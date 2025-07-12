export default () => ({
  transport: {
    nats: {
      servers: process.env.NATS_SERVERS?.split(','),
    },
  },
});
