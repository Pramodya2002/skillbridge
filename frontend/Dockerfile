FROM node:20

WORKDIR /app

# Install dependencies first
COPY package.json yarn.lock ./
RUN yarn install

# Copy project files
COPY . .

# Run development server
CMD ["yarn", "dev", "--host", "0.0.0.0"]
