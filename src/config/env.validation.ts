import * as Joi from 'joi';

export default Joi.object({
  NATS_SERVERS: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
}).unknown(true);
