import * as Joi from 'joi';

export default Joi.object({
  NATS_SERVERS: Joi.string().required(),
}).unknown(true);
