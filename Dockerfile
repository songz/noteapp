# Build image
FROM node:12.18-alpine AS build
WORKDIR /build

# Install only the production dependencies
RUN npm i

COPY . /build

USER node

ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
