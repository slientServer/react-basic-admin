const Geetest = require('gt3-sdk');

module.exports = class extends think.Logic {

  async __before() {
    if (think.config('isEnableCaptcha') === true) {
      let rules = {
        geetest_challenge: {
            string: true,       // 字段类型为 String 类型
            required: true,     // 字段必填
            method: 'post'       // 指定获取数据的方式
        },
        geetest_validate: {
            string: true,       // 字段类型为 String 类型
            required: true,     // 字段必填
            method: 'post'       // 指定获取数据的方式
        },
        geetest_seccode: {
            string: true,       // 字段类型为 String 类型
            required: true,     // 字段必填
            method: 'post'       // 指定获取数据的方式
        }
      }
      let flag = this.validate(rules);
      let postData = this.ctx.post();
      if (!flag || ! (await this.verifyCaptcha(postData))) {
        return this.fail(400, 'Please input correct captcha!', this.validateErrors);
      }
    }
  }

  loginAction() {
    this.allowMethods = 'post';
    let rules = {
      username: {
          string: true,       // 字段类型为 String 类型
          required: true,     // 字段必填
          method: 'post',       // 指定获取数据的方式
          trim: true
      },
      password: {
          string: true,       // 字段类型为 String 类型
          required: true,     // 字段必填
          method: 'post',       // 指定获取数据的方式
          trim: true
      }
    }
    let flag = this.validate(rules);
    if (!flag) {
      return this.fail(400, 'Please input username or password!', this.validateErrors);
    } 
  }

  registerAction () {
    this.allowMethods = 'post';
    if (!think.config('isEnableRegister')) {
      return this.fail(403, 'Invalid request!');
    }
    let rules = {
      username: {
          string: true,       // 字段类型为 String 类型
          required: true,     // 字段必填
          method: 'post',       // 指定获取数据的方式
          trim: true
      },
      password: {
          string: true,       // 字段类型为 String 类型
          required: true,     // 字段必填
          method: 'post',       // 指定获取数据的方式
          trim: true
      },
      confirm: {
          string: true,       // 字段类型为 String 类型
          required: true,     // 字段必填
          method: 'post',       // 指定获取数据的方式
          trim: true        
      },
      email: {
          string: true,       // 字段类型为 String 类型
          required: true,     // 字段必填
          method: 'post',       // 指定获取数据的方式
          trim: true        
      },
      employeeid: {
          string: true,       // 字段类型为 String 类型
          required: true,     // 字段必填
          method: 'post',       // 指定获取数据的方式
          trim: true        
      },
      location: {
          array: true,
          required: true,     // 字段必填
          method: 'post'       // 指定获取数据的方式
      },
      company: {
        string: true,
        required: true,     // 字段必填
        method: 'post'       // 指定获取数据的方式
      }
    }
    let flag = this.validate(rules);
    if (!flag) {
      return this.fail(400, 'Please input all required fields!', this.validateErrors);
    }    
  }

  async verifyCaptcha (data) {
    // 对form表单提供的验证凭证进行验证
    let captcha = new Geetest({
      geetest_id: think.config('geetest').geetest_id,
      geetest_key: think.config('geetest').geetest_key
    });
    try {
      let res = await captcha.validate((await this.session('fallback')), {
        geetest_challenge: data.geetest_challenge,
        geetest_validate: data.geetest_validate,
        geetest_seccode: data.geetest_seccode
      });
      return res;      
    } catch (err) {
      return false;
    }
  }
};
