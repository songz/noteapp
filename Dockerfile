# Build image
FROM node:12.18-alpine AS build

# Install only the production dependencies
RUN npm i

USER node

EXPOSE 3000
CMD ["npm", "start"]
