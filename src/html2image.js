const phantom = require('phantom');

class Html2image {
  constructor(opts = {}){
    this.config = {
      width: undefined,
      height: undefined, 
      type: 'PNG', 
      url: '', 
      name: '', 
      timeout: 5000,
      clipRect: undefined,
      method: undefined,
      data: undefined,
      bgColor: undefined,
      ...opts
    };
  }
  async render(opts = {}){
    Object.assign(this.config, opts);
    let {width, height, type, url, name, timeout, zoom, clipRect, method, data, bgColor} = this.config;

    const instance = await phantom.create();
    const page = await instance.createPage();

    await page.on('onResourceRequested', function(requestData) {
      //console.info('Requesting', requestData.url);
    });
    let status = '';
    if(data){
      data = typeof data == 'object' ? JSON.stringify(data) : data;
      status = await page.open(url, method || 'GET', data);
    }else{
      status = await page.open(url);
    }
    if (status != "success"){  
      //console.log('FAIL to load the address');  
      instance.exit();  
      return;
    } 
    if(bgColor) {
      page.evaluateJavaScript(`function(){document.body.style.backgroundColor = "${bgColor}"}`);
    }
    page.property('viewportSize', {width, height});
    // await setTimeout(() => {}, timeout);
    // page.property('settings', {
    //   javascriptEnabled: true,
    //   loadImages: true,
    //   userAgent: 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.31 (KHTML, like Gecko) PhantomJS/19.0'
    // });
    if(zoom) page.property('zoomFactor', zoom);
    if(clipRect && typeof clipRect == 'object'){
      page.property('clipRect', {
        top: 0,
        left: 0,
        width,
        height,
        ...clipRect
      });
    }
    // const result = await page.property('content');
    // console.log(content);
    let result = await page.renderBase64(type);
    await page.close();
    await instance.exit();
    return result;
  }
}

module.exports = Html2image;