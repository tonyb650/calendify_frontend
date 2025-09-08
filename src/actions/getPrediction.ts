import { currentUser } from "@/db/auth"
// import { getCurrentUser } from "@/db/users"
import { timeSlotStatus } from "@/lib/timeSlots"
import * as tf from "@tensorflow/tfjs"

export default async function getPrediction(date: Date): Promise<number[]|null> {


  
  const currentTimeSlotStatus = await timeSlotStatus(date)
  const user = await currentUser()

  // TODO better way to manage 'null' user
  const earliest = user?.earliest || 8
  const latest = user?.latest || 24

  currentTimeSlotStatus.unshift(earliest, latest)
  console.log(currentTimeSlotStatus)
  
  const model = await tf.loadLayersModel("http://localhost:3000/models/model.json")

  let inputTensor: tf.Tensor | null = null
  let reshapedInput: tf.Tensor | null = null
  let prediction: tf.Tensor<tf.Rank> | tf.Tensor<tf.Rank>[] | null = null

  try {
    inputTensor = tf.tensor(currentTimeSlotStatus)
    reshapedInput = inputTensor.reshape([1, 50])
    console.log(reshapedInput)
    
    prediction = model.predict(reshapedInput)
    
    if (prediction instanceof tf.Tensor) {
      const predictionArray = prediction.arraySync() as number[][];
      return predictionArray[0];
    }
    
    return null
  } finally {
    // Dispose of all tensors to free GPU memory
    inputTensor?.dispose()
    reshapedInput?.dispose()
    if (prediction instanceof tf.Tensor) {
      prediction.dispose()
    }
    model.dispose() // Also dispose of the model when done
    //! 
    console.log(tf.memory().numTensors)
  }
}
