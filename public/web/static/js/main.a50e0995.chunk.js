(this["webpackJsonpimgrepo-web"]=this["webpackJsonpimgrepo-web"]||[]).push([[0],{103:function(e,t,n){"use strict";n.r(t);var a=n(11),i=n(0),s=n.n(i),r=n(17),o=n.n(r),c=(n(97),n(83)),l=n(29),d=n(84),u=n(67),g=n(68),p=n(27),h=n(88),f=n(82),m=(n(65),n(107)),j=n(110),b=n(108),v=n(109),O=n(28),x=n(111),y=n(106),w=n(113),U=n(114),C=n(115),S=n(90),k=n(89),I=n(116),D=n(117),N=n(69),L=n.n(N);n(98);var P=function(e,t){if(e){var n,a=null===(n=window.localStorage)||void 0===n?void 0:n.getItem(e);if(a)return JSON.parse(a)}return t}("config",{serverUrl:"http://35.173.93.67:8080",email:"guest@gmail.com",password:"password"});function E(e,t){return e.endsWith("/")?t.startsWith("/")?e+t.substr(1):e+t:t.startsWith("/")?e+t:e+"/"+t}function B(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"GET",n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:void 0;return fetch(E(P.serverUrl,e),{method:t,headers:{email:P.email,password:P.password},body:n?JSON.stringify(n):void 0}).then((function(e){return e.json()}))}function J(){return B("/api/images","GET")}function T(e){return fetch(E(P.serverUrl,e?"api/signup":"api/login"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:P.email,password:P.password})}).then((function(e){return e.json()}))}function M(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"original";return fetch(E(P.serverUrl,"/api/images/".concat(e,"?type=").concat(t)),{method:"GET",headers:{email:P.email,password:P.password}}).then((function(e){return e.blob()}))}var F=n(32),V=new Map;function q(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=arguments.length>2?arguments[2]:void 0;if(V.has(e)){var i=V.get(e);return Object(a.jsx)("img",Object(l.a)(Object(l.a)({src:i},t),{},{alt:""}))}return M(e,"thumbnail").then((function(e){return URL.createObjectURL(e)})).then((function(t){V.set(e,t),n&&n("img-downloaded",e)})),Object(a.jsx)(F.a,Object(l.a)({},t))}var G=function(e){Object(h.a)(n,e);var t=Object(f.a)(n);function n(e){var a;return Object(u.a)(this,n),(a=t.call(this,e)).state={signedUp:!1,query:"",images:[],settingsVisible:!1,editingConfig:{}},a.uploadFileList=[],a.getDropdownMenu=a.getDropdownMenu.bind(Object(p.a)(a)),a.getUploadProps=a.getUploadProps.bind(Object(p.a)(a)),a.onUpdateConfig=a.onUpdateConfig.bind(Object(p.a)(a)),a.onConfigUpdated=a.onConfigUpdated.bind(Object(p.a)(a)),a.onSearchImages=a.onSearchImages.bind(Object(p.a)(a)),a.onDownloadImage=a.onDownloadImage.bind(Object(p.a)(a)),a.onDeleteImage=a.onDeleteImage.bind(Object(p.a)(a)),a}return Object(g.a)(n,[{key:"componentDidMount",value:function(){this.reload(!1)}},{key:"reload",value:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]&&arguments[0];this.setState({query:"",images:[]}),T(t).then((function(t){return e.setState({signedUp:"success"===t.status}),J()})).then((function(t){"success"===t.status&&e.setState({images:t.result})}))}},{key:"getDropdownMenu",value:function(e){var t=this;return Object(a.jsxs)(m.a,{onClick:function(n){n.item;var a=n.key;"download"===a?t.onDownloadImage(e):"delete"===a&&t.onDeleteImage(e)},children:[Object(a.jsx)(m.a.Item,{children:"Download"},"download"),Object(a.jsx)(m.a.Item,{children:"Delete"},"delete")]})}},{key:"getUploadProps",value:function(e){var t=this;return{name:"images",accept:"image/*",action:"".concat(P.serverUrl,"/api/images?type=").concat(e),headers:{email:P.email,password:P.password},showUploadList:!1,beforeUpload:function(e){var t="image/jpeg"===e.type||"image/png"===e.type;t||j.b.error("You can only upload JPG/PNG file!");var n=e.size/1024/1024<10;return n||j.b.error("Image must smaller than 10MB!"),t&&n},onChange:function(e){if("done"===e.file.status){var n=[];e.fileList.forEach((function(t){"success"===t.response.status&&(n.push(t.response),j.b.success("".concat(e.file.name," uploaded.")))})),n.length>0&&t.setState({images:[].concat(Object(d.a)(t.state.images),n)}),t.forceUpdate()}else"error"===e.file.status&&j.b.error("".concat(e.file.name," upload failed."))}}}},{key:"onSearchImages",value:function(){var e,t=this,n=this.state.query;n?(e=n,B("/api/images/search?q=".concat(e),"GET")).then((function(e){"success"===e.status&&t.setState({images:e.result})})):J().then((function(e){"success"===e.status&&t.setState({images:e.result})}))}},{key:"onDownloadImage",value:function(e){M(e.id,"original").then((function(t){L.a.saveAs(t,e.name)})).catch((function(t){b.a.open({message:"image",description:"failed to download ".concat(e.name,", ").concat(JSON.stringify(t))})}))}},{key:"onDeleteImage",value:function(e){var t,n=this;(t=e.id,B("/api/images/".concat(t),"DELETE")).then((function(t){"success"===t.status?n.setState({images:n.state.images.filter((function(t){return t.id!==e.id}))}):b.a.open({message:"image",description:"failed to delete ".concat(e.name)})})).catch((function(t){b.a.open({message:"image",description:"failed to delete ".concat(e.name,", ").concat(JSON.stringify(t))})}))}},{key:"onUpdateConfig",value:function(e,t){var n=Object(l.a)({},this.state.editingConfig);n[e]=t.target.value,this.setState({editingConfig:n})}},{key:"onConfigUpdated",value:function(e){for(var t=this.state.editingConfig,n=0,a=Object.entries(t);n<a.length;n++){var i=Object(c.a)(a[n],2),s=i[0],r=i[1];P[s]=r}!function(e,t){var n;e&&void 0!==t&&null!==t&&(null===(n=window.localStorage)||void 0===n||n.setItem(e,JSON.stringify(t)))}("config",P),this.reload(e)}},{key:"renderSettings",value:function(){var e=this,t=this.state.editingConfig;return Object(a.jsxs)("div",{style:{margin:"8px"},children:[Object(a.jsx)(v.a,{style:{margin:"16px"},value:t.serverUrl,onChange:function(t){return e.onUpdateConfig("serverUrl",t)}}),Object(a.jsx)(v.a,{type:"emial",size:"large",prefix:Object(a.jsx)(U.a,{}),style:{margin:"16px"},value:t.email,onChange:function(t){return e.onUpdateConfig("email",t)}}),Object(a.jsx)(v.a.Password,{style:{margin:"16px"},value:t.password,onChange:function(t){return e.onUpdateConfig("password",t)},iconRender:function(e){return e?Object(a.jsx)(C.a,{}):Object(a.jsx)(S.a,{})}}),Object(a.jsxs)("div",{style:{display:"flex"},children:[Object(a.jsx)("span",{style:{flex:"auto"}}),Object(a.jsx)(O.a,{onClick:function(t){return e.setState({settingsVisible:!1})},children:"Cancel"}),Object(a.jsx)(O.a,{style:{margin:"0 16px"},onClick:function(t){e.setState({settingsVisible:!1}),e.onConfigUpdated(!0)},children:"Sign Up"}),Object(a.jsx)(O.a,{type:"primary",onClick:function(t){e.setState({settingsVisible:!1}),e.onConfigUpdated(!1)},children:"Login"})]})]})}},{key:"renderSearchBar",value:function(){var e=this;return Object(a.jsxs)("div",{className:"search-bar",children:[Object(a.jsx)("div",{className:"search-bar-title",children:"Search Images"}),Object(a.jsx)(v.a,{placeholder:"search images by name",prefix:Object(a.jsx)(k.a,{}),value:this.state.query,onChange:function(t){e.setState({query:t.target.value})},onPressEnter:function(t){e.onSearchImages()}})]})}},{key:"renderImages",value:function(){var e=this,t=this.state.images,n={width:"100px",height:"100px",cursor:"pointer"};return Object(a.jsx)("div",{className:"images-container",children:t.map((function(t){return Object(a.jsxs)("div",{className:"img-container",children:[Object(a.jsx)(x.a,{overlay:e.getDropdownMenu(t),placement:"bottomCenter",arrow:!0,children:q(t.id,n,(function(t,n){return e.forceUpdate()}))}),Object(a.jsx)("span",{className:"img-name",children:t.name})]},"img#".concat(t.id))}))})}},{key:"renderUploadButton",value:function(e){var t=this;return Object(a.jsx)(y.a,Object(l.a)(Object(l.a)({},this.getUploadProps(e)),{},{fileList:this.uploadFileList,children:Object(a.jsx)(O.a,{icon:Object(a.jsx)(I.a,{}),onClick:function(){t.uploadFileList=[]},style:{margin:"16px 16px 0 0"},children:"private"===e?"Upload private image":"Upload public image"})}))}},{key:"render",value:function(){var e=this,t=this.state,n=t.settingsVisible,i=t.signedUp;return Object(a.jsxs)("div",{className:"app",children:[Object(a.jsxs)("div",{style:{display:"flex"},children:[Object(a.jsx)("span",{className:"app-title",children:"Bruce's Image Repository"}),Object(a.jsx)("span",{style:{flex:"auto"}}),Object(a.jsx)(w.a,{placement:"topLeft",title:"Settings",visible:n,onVisibleChange:function(t){e.setState({editingConfig:Object(l.a)({},P),settingsVisible:t})},content:this.renderSettings.bind(this),trigger:"click",children:Object(a.jsx)(D.a,{})})]}),Object(a.jsx)("div",{className:"section",children:this.renderSearchBar()}),Object(a.jsx)("div",{style:{display:"flex"},children:this.renderImages()}),i&&Object(a.jsxs)("div",{children:[this.renderUploadButton("private"),this.renderUploadButton("public")]})]})}}]),n}(s.a.Component),R=function(e){e&&e instanceof Function&&n.e(3).then(n.bind(null,118)).then((function(t){var n=t.getCLS,a=t.getFID,i=t.getFCP,s=t.getLCP,r=t.getTTFB;n(e),a(e),i(e),s(e),r(e)}))};o.a.render(Object(a.jsx)(s.a.StrictMode,{children:Object(a.jsx)(G,{})}),document.getElementById("root")),R()},97:function(e,t,n){},98:function(e,t,n){}},[[103,1,2]]]);
//# sourceMappingURL=main.a50e0995.chunk.js.map