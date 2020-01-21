/**
 * Wood Plugin Module.
 *网页转图片
 * by jlego on 2019-5-10
 */
const Html2image = require('./src/html2image');

module.exports = (app = {}, config = {}) => {
  app.Html2image = new Html2image(config);
  if(app.addAppProp) app.addAppProp('Html2image', app.Html2image);
  return app;
}
