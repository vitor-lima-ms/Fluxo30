import { celebrate, Joi } from 'celebrate';

export default celebrate({
  body: Joi.object()
    .keys({
      email: Joi.string()
        .email({ tlds: { allow: false } })
        .required(),
      password: Joi.string().min(1).required(),
    })
    .required(),
});
