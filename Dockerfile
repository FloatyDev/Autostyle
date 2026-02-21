FROM node:22-alpine

# Set working directory inside the container
WORKDIR /app

# Ensure we can run npm natively without permissions issues 
# (useful for vite initialization and dev)
EXPOSE 5173

# The default command will be overridden by docker-compose, but we can put a fallback
CMD ["npm", "run", "dev", "--", "--host"]
