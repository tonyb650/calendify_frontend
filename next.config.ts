// @ts-nocheck
import { PrismaPlugin } from "@prisma/nextjs-monorepo-workaround-plugin"

const nextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.plugins.push(new PrismaPlugin())
    }
    return config
  },
}

export default nextConfig
