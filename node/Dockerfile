ARG NODE_VERSION=22.13.1

FROM node:${NODE_VERSION}-slim AS base

USER node
WORKDIR /home/node
COPY --chown=node:node package*.json ./

#
# Development env image
#

FROM base AS development
USER node
WORKDIR /home/node
# Install all deps including development
RUN yarn install --frozen-lockfile
# Copy the whole dir instead of only "./src", otherwise directories with test
# files won't be included
COPY --chown=node:node . .
CMD yarn run serve

#
# Production env image
#

# Stage 1: compile TS to JS

FROM base AS js
USER node
WORKDIR /home/node
COPY --chown=node:node tsconfig*.json ./
# Install dependencies before copying .src, to leverage Docker build cache
RUN yarn install --frozen-lockfile && yarn cache clean
COPY --chown=node:node ./src ./src
RUN yarn run build

# Stage 2: strip all things TypeScript from our image.

FROM base AS production_base
USER node
WORKDIR /home/node
COPY --chown=node:node --from=js /home/node/build ./
# Install only production dependencies
RUN yarn install --ignore-scripts --production

# Stage 3: create final production image ready to be deployed - copy only the
# required files from stages above.

FROM node:${NODE_VERSION}-slim AS production
USER node
WORKDIR /home/node
COPY --from=production_base /home/node ./
# Run the app direcly, without NPM to be able to handle error signals.
# If you run it via NPM, if error happens, the process that will recieve an error wiill be the initial process - NPM - instead of node.
CMD ["node", "index.js"]

#
#
#WORKDIR /node

#COPY package*.json ./
#RUN yarn install

#USER node
#COPY . .

#CMD yarn run serve
