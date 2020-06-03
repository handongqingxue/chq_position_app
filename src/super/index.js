import superagent from 'superagent'
import { Toast } from 'antd-mobile';
import Units from './../units'

const api=Units.api()
export default class Superagent {
	static super(options,type) {
		const tokenName = Units.getLocalStorge("tokenName")
		let ty="form"
		let method=options.method?options.method:"POST";
        if(type==="formdata"){
            ty=null
        }else if(type==="json"){
            ty="application/json"
        }
		return new Promise((resolve, reject) => {
			superagent(method,Units.api()+options.url)
				.type(ty)
				.set("hydrocarbon-token", tokenName)
				.query(options.query || '')
				.send(options.data || '')
				.end((req, res) => {
					//console.log(res.body)
					if(res.status === 200) {
						Units.setLocalStorge("tokenName",tokenName)
						resolve(res.body)
					} else if(res.status === 403) {
						Toast.info("请求权限不足,可能是token已经超时")
						//window.location.hash = "/login";
						window.location.hash = "/test";
					} else if(res.status === 404 || res.status === 504) {
						Toast.info("服务器未开···")
					} else if(res.status === 500) {
						Toast.info("后台处理错误。")
					} else {
						reject(res.body)
					}
				})
		})
	}
}