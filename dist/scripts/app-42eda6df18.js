!function(){"use strict";angular.module("formioServiceTrackerApp",["formio","ui.router","ngMap","bgf.paginateAnything","angularMoment"]).filter("capitalize",[function(){return _.capitalize}]).filter("truncate",[function(){return function(e,t){return _.isNumber(t)&&(t={length:t}),_.truncate(e,t)}}]).provider("Resource",["$stateProvider",function(e){var t={};return{register:function(r,o,a){t[r]=r;var n=a&&a.parent?a.parent:null,i=r+"Id",s=function(e){var t={};return t[i]=e._id,t},m=function(e){return["$scope","$rootScope","$state","$stateParams","Formio","FormioUtils","$controller",e]},c=a&&a.templates?a.templates:{};e.state(r+"Index",{url:"/"+r,parent:n?n:null,params:a.params&&a.params.index,templateUrl:c.index?c.index:"views/resource/index.html",controller:m(function(e,t,n,m,c,u,l){e.currentResource={name:r,queryId:i,formUrl:o},e.$on("submissionView",function(e,t){n.go(r+".view",s(t))}),e.$on("submissionEdit",function(e,t){n.go(r+".edit",s(t))}),e.$on("submissionDelete",function(e,t){n.go(r+".delete",s(t))}),a&&a.index&&l(a.index,{$scope:e})})}).state(r+"Create",{url:"/create/"+r,parent:n?n:null,params:a.params&&a.params.create,templateUrl:c.create?c.create:"views/resource/create.html",controller:m(function(e,t,n,m,c,u,l){e.currentResource={name:r,queryId:i,formUrl:o},e.submission={data:{}};var d=!1;if(a&&a.create){var p=l(a.create,{$scope:e});d=p.handle||!1}d||e.$on("formSubmission",function(e,t){n.go(r+".view",s(t))})})}).state(r,{"abstract":!0,url:"/"+r+"/:"+i,parent:n?n:null,templateUrl:"views/resource.html",controller:m(function(e,t,s,m,c,u,l){var d=o+"/submission/"+m[i];e.currentResource=e[r]={name:r,queryId:i,formUrl:o,submissionUrl:d,formio:new c(d),resource:{},form:{},href:"/#/"+r+"/"+m[i]+"/",parent:n?e[n]:{href:"/#/",name:"home"}},e.currentResource.loadFormPromise=e.currentResource.formio.loadForm().then(function(t){e.currentResource.form=e[r].form=t}),e.currentResource.loadSubmissionPromise=e.currentResource.formio.loadSubmission().then(function(t){e.currentResource.resource=e[r].submission=t}),a&&a["abstract"]&&l(a["abstract"],{$scope:e})})}).state(r+".view",{url:"/",parent:r,params:a.params&&a.params.view,templateUrl:c.view?c.view:"views/resource/view.html",controller:m(function(e,t,r,o,n,i,s){a&&a.view&&s(a.view,{$scope:e})})}).state(r+".edit",{url:"/edit",parent:r,params:a.params&&a.params.edit,templateUrl:c.edit?c.edit:"views/resource/edit.html",controller:m(function(e,t,o,n,i,m,c){var u=!1;if(a&&a.edit){var l=c(a.edit,{$scope:e});u=l.handle||!1}u||e.$on("formSubmission",function(e,t){o.go(r+".view",s(t))})})}).state(r+".delete",{url:"/delete",parent:r,params:a.params&&a.params["delete"],templateUrl:c["delete"]?c["delete"]:"views/resource/delete.html",controller:m(function(e,t,r,o,i,s,m){var c=!1;if(a&&a["delete"]){var u=m(a["delete"],{$scope:e});c=u.handle||!1}c||e.$on("delete",function(){n&&"home"!==n?r.go(n+".view"):r.go("home",null,{reload:!0})})})})},$get:function(){return t}}}]).directive("fileread",[function(){return{scope:{fileread:"="},link:function(e,t){t.bind("change",function(t){var r=new FileReader;r.onloadend=function(t){e.$apply(function(){e.fileread=jQuery(t.target.result)})},r.readAsText(t.target.files[0])})}}}]).config(["FormioProvider","ResourceProvider","$stateProvider","$urlRouterProvider","AppConfig",function(e,t,r,o,a){e.setBaseUrl(a.apiUrl),r.state("home",{url:"",templateUrl:"views/main.html"}).state("appointments",{url:"/appointments",parent:"home",templateUrl:"views/appointments.html",params:{filter:{},startDate:moment().startOf("day").toDate(),endDate:moment().endOf("day").add(7,"days").toDate(),time_filter:{},time_startDate:moment().startOf("day").toDate(),time_endDate:moment().endOf("day").add(7,"days").toDate()},controller:["$scope","$rootScope","$stateParams","Formio",function(e,t,r,o){e.appointments=[],e.appointmentsUrl=a.appointmentForm+"/submission",e.filter=r.filter,e.minDate=moment().startOf("day").toDate(),e.startDate=r.startDate,e.endDate=r.endDate,t.isAdmin||(e.filter["customer.data.dealer._id"]=t.getDealer()._id),t.isContractor&&!e.filter["assignedContractor._id"]&&(e.filter["assignedContractor._id"]=t.user._id),e.urlParams=t.getUrlParams(e.filter),e.urlParams.sort="data.appointmentTime",e.urlParams["data.appointmentTime__gte"]=e.startDate.toISOString(),e.urlParams["data.appointmentTime__lte"]=e.endDate.toISOString(),e.timeclocks=[],e.timeclocksUrl=a.timeclockForm+"/submission",e.time_filter=r.time_filter,e.time_startDate=r.time_startDate,e.time_endDate=r.time_endDate,t.isContractor&&(e.time_filter["appointment.data.assignedContractor._id"]=t.user._id),t.isDealer&&(e.time_filter["appointment.data.assignedContractor.data.dealer._id"]=t.getDealer()._id),e.time_urlParams=t.getUrlParams(e.time_filter),e.time_urlParams.sort="data.time",e.time_urlParams["data.time__gte"]=e.time_startDate.toISOString(),e.time_urlParams["data.time__lte"]=e.time_endDate.toISOString(),e.refreshContractors=function(r){var n={};t.isAdmin||(n={"data.dealer._id":t.getDealer()._id}),r&&(n["data.name__regex"]="/"+_.escapeRegExp(r)+"/i"),new o(a.contractorForm).loadSubmissions({params:n}).then(function(t){e.contractors=t})}}]}).state("myforms",{url:"/forms",parent:"home",templateUrl:"views/myforms.html"}).state("auth",{"abstract":!0,url:"/auth",templateUrl:"views/user/auth.html"}).state("auth.dealerlogin",{url:"/dealer",parent:"auth",templateUrl:"views/user/dealerlogin.html",controller:["$scope","$state","$rootScope",function(e,t,r){e.$on("formSubmission",function(e,o){o&&(r.setUser(o,"dealer"),t.go("home"))})}]}).state("auth.adminlogin",{url:"/admin",parent:"auth",templateUrl:"views/user/adminlogin.html",controller:["$scope","$state","$rootScope",function(e,t,r){e.$on("formSubmission",function(e,o){o&&(r.setUser(o,"admin"),t.go("home"))})}]}).state("auth.contractorlogin",{url:"/contractor",parent:"auth",templateUrl:"views/user/contractorlogin.html",controller:["$scope","$state","$rootScope",function(e,t,r){e.$on("formSubmission",function(e,o){o&&(r.setUser(o,"contractor"),t.go("home"))})}]});var n=function(e,t,r){var o=[],a=e.$on("formLoad",function(e,a){t.eachComponent(a.components,function(e){for(var t in r){var a=r[t];e.key===a&&(o.push({component:e,originalType:e.type}),e.type="hidden")}})});e.$on("$destroy",function(){a(),angular.forEach(o,function(e){e.component.type=e.originalType})})};t.register("contractor",a.contractorForm,{parent:"home",templates:{index:"views/contractor/index.html"},params:{index:{filter:{}}},index:["$scope","$rootScope","$stateParams",function(e,t,r){if(e.contractors=[],e.contractorsUrl=a.contractorForm+"/submission",e.filter=r.filter,!t.isAdmin){var o=t.getDealer();o&&(e.filter["dealer._id"]=o._id)}e.urlParams=t.getUrlParams(e.filter)}],create:["$scope","$rootScope","FormioUtils",function(e,t,r){t.isAdmin||(e.submission.data={dealer:t.getDealer()},n(e,r,["dealer"]))}],view:["$scope","$rootScope","FormioUtils",function(e,t,r){var o=["password","submit"];t.isAdmin||o.push("dealer"),n(e,r,o)}],edit:["$scope","$rootScope","FormioUtils",function(e,t,r){t.isAdmin||n(e,r,["dealer"])}]}),t.register("customer",a.customerForm,{parent:"home",templates:{view:"views/customer/view.html",index:"views/customer/index.html"},params:{index:{filter:{},showInactive:!1}},"abstract":["$scope","$rootScope",function(e,t){t.isAdmin||(e.hideDelete=!0)}],index:["$scope","$rootScope","$stateParams",function(e,t,r){e.customers=[],e.customersUrl=a.customerForm+"/submission",e.filter=r.filter,e.showInactive=r.showInactive,t.isAdmin||(e.filter["dealer._id"]=t.getDealer()._id),e.urlParams=t.getUrlParams(e.filter),e.showInactive||(e.urlParams["data.inactive"]=!1)}],create:["$scope","$rootScope","FormioUtils",function(e,t,r){t.isAdmin||(e.submission.data={dealer:t.getDealer()},n(e,r,["dealer"]))}],view:["$scope","$rootScope","$state","$stateParams","Formio",function(e,t,r,o,n){e.position={lat:"40.74",lng:"-74.18"},e.$watch("currentResource.resource.data.address.geometry.location",function(t){t&&(e.position.lat=t.lat,e.position.lng=t.lng)}),e.equipment=[],e.equipmentUrl=a.equipmentForm+"/submission",e.equipmentUrlParams={"data.customer._id":e.currentResource.resource._id},e.appointments=[],e.appointmentsUrl=a.appointmentForm+"/submission",e.appointmentsUrlParams={"data.customer._id":e.currentResource.resource._id},e.forms=a.forms,e.formSubmissions={},e.gotoSubmission=function(e,t){var o={};o[e.name+"Id"]=t._id,o.customerId=t.data.customer._id,r.go(e.name+".view",o)},e.$watch("currentResource.resource",function(t){t.data&&angular.forEach(e.forms,function(r){e.formSubmissions[r.name]=[],new n(r.form).loadSubmissions({params:{"data.customer._id":t._id}}).then(function(t){e.formSubmissions[r.name]=t})})})}],edit:["$scope","$rootScope","FormioUtils",function(e,t,r){t.isAdmin||n(e,r,["dealer"])}]}),t.register("dealer",a.dealerForm,{parent:"home",templates:{index:"views/dealer/index.html"},params:{index:{filter:{}}},index:["$scope","$rootScope","$stateParams","FormioUtils",function(e,t,r,o){if(t.isAdmin)e.dealers=[],e.dealersUrl=a.dealerForm+"/submission",e.filter=r.filter,e.urlParams=t.getUrlParams(e.filter);else{var i=t.getDealer();i&&(e.dealerUrl=a.dealerForm+"/submission/"+i._id,t.isDealer||n(e,o,["password"]))}}],create:["$scope","$rootScope","$state",function(e,t,r){t.isAdmin||r.go("home")}],view:["$scope","$rootScope","FormioUtils",function(e,t,r){n(e,r,["password","submit"])}],edit:["$scope","$rootScope","$state",function(e,t,r){t.isAdmin||r.go("home")}],"delete":["$scope","$rootScope","$state",function(e,t,r){t.isAdmin||r.go("home")}]}),t.register("appointment",a.appointmentForm,{parent:"customer",templates:{view:"views/appointment/view.html"},params:{create:{customer:null}},create:["$scope","$rootScope","$stateParams","FormioUtils",function(e,t,r,o){e.submission={data:{}},e.$watch("customer",function(t){t.resource&&t.resource.data&&(e.submission.data.customer=t.resource)},!0),n(e,o,["customer"]),t.isAdmin||e.$on("formLoad",function(e,r){var a=o.getComponent(r.components,"customer"),n=o.getComponent(r.components,"assignedContractor"),i={"data.dealer._id":t.getDealer()._id};a.params=i,n.params=i}),t.isContractor&&(e.submission.data.assignedContractor=t.user)}],view:["$scope","$rootScope","$stateParams",function(e,t,r){e.timeclocks=[],e.timeclocksUrl=a.timeclockForm+"/submission",e.urlParams={sort:"data.time"},e.services=[],e.servicesUrl=a.serviceForm+"/submission",e.serviceUrlParams={"data.appointment._id":r.appointmentId,sort:"created"}}],edit:["$scope","$rootScope","FormioUtils",function(e,t,r){t.isAdmin||e.$on("formLoad",function(e,o){var a=r.getComponent(o.components,"customer"),n=r.getComponent(o.components,"assignedContractor"),i={"data.dealer._id":t.getDealer()._id};a.params=i,n.params=i})}]}),t.register("timeclock",a.timeclockForm,{parent:"appointment",params:{create:{appointmentId:null}},templates:{view:"views/timeclock/view.html"},create:["$scope","$rootScope","$stateParams","Formio","FormioUtils",function(e,t,r,o,a){e.submission={data:{}},e.$watch("appointment",function(t){t&&t.resource&&(e.submission.data.appointment=t.resource)},!0),n(e,a,["appointment"]),t.isAdmin||e.$on("formLoad",function(e,r){var o,n=a.getComponent(r.components,"appointment");t.isDealer&&(o={"data.customer.data.dealer._id":t.getDealer()._id}),t.isContractor&&(o={"data.assignedContractor._id":t.user._id}),n.params=o}),e.$on("formSubmit",function(e,t){t.owner=t.data.appointment.data.assignedContractor._id}),navigator.geolocation?navigator.geolocation.getCurrentPosition(function(t){e.submission.data.gpsLatitude=t.coords.latitude,e.submission.data.gpsLongitude=t.coords.longitude},function(){console.warn("Unable to retrieve location")}):console.warn("Geolocation is not supported. Cannot add GPS data to this time entry.")}],edit:["$scope","$rootScope","FormioUtils",function(e,t,r){t.isAdmin||e.$on("formLoad",function(e,o){var a,n=r.getComponent(o.components,"appointment");t.isDealer&&(a={"data.customer.data.dealer._id":t.getDealer()._id}),t.isContractor&&(a={"data.assignedContractor._id":t.user._id}),n.params=a}),e.$on("formSubmit",function(e,t){t.owner=t.data.appointment.data.assignedContractor._id})}],"delete":["$scope","$rootScope","$state",function(e,t,r){return e.$on("delete",function(){r.go("appointment.view",{appointmentId:e.currentResource.resource.data.appointment._id})}),!0}]}),t.register("equipment",a.equipmentForm,{parent:"customer",params:{create:{customerId:null}},templates:{view:"views/equipment/view.html"},create:["$scope","$rootScope","$stateParams","Formio","FormioUtils",function(e,t,r,o,a){e.submission={data:{}},e.$watch("customer",function(t){t.resource&&t.resource.data&&(e.submission.data.customer=t.resource)},!0),n(e,a,["customer"]),t.isAdmin||e.$on("formLoad",function(e,r){var o=a.getComponent(r.components,"customer"),n={"data.dealer._id":t.getDealer()._id};o.params=n})}],edit:["$scope","$rootScope","FormioUtils",function(e,t,r){n(e,r,["customer"]),t.isAdmin||e.$on("formLoad",function(e,o){var a=r.getComponent(o.components,"customer"),n={"data.dealer._id":t.getDealer()._id};a.params=n})}]}),t.register("service",a.serviceForm,{parent:"appointment",templates:{view:"views/service/view.html"},create:["$scope","$rootScope","$stateParams","Formio","FormioUtils",function(e,t,r,o,a){e.submission={data:{}},e.$watch("appointment",function(t){t&&t.resource&&(e.submission.data.appointment=t.resource)},!0),n(e,a,["appointment"]),t.isAdmin||e.$on("formLoad",function(e,r){var o,n=a.getComponent(r.components,"appointment");t.isDealer&&(o={"data.customer.data.dealer._id":t.getDealer()._id}),t.isContractor&&(o={"data.assignedContractor._id":t.user._id}),n.params=o})}],edit:["$scope","$rootScope","FormioUtils",function(e,t,r){n(e,r,["appointment"]),t.isAdmin||e.$on("formLoad",function(e,o){var a,n=r.getComponent(o.components,"appointment");t.isDealer&&(a={"data.customer.data.dealer._id":t.getDealer()._id}),t.isContractor&&(a={"data.assignedContractor._id":t.user._id}),n.params=a})}]}),angular.forEach(a.forms,function(e){t.register(e.name,e.form,{parent:"customer",params:{create:{customerId:null}},create:["$scope","$rootScope","$state","$stateParams","Formio","FormioUtils",function(e,t,r,o,a,i){return e.submission={data:{}},e.$watch("customer",function(t){t.resource&&t.resource.data&&(e.submission.data.customer=t.resource)},!0),n(e,i,["customer"]),e.$on("formSubmission",function(){r.go("customer.view")}),{handle:!0}}]})}),o.otherwise("/appointment")}]).factory("FormioAlerts",["$rootScope",function(e){var t=[];return{addAlert:function(r){e.alerts.push(r),r.element?angular.element("#form-group-"+r.element).addClass("has-error"):t.push(r)},getAlerts:function(){var e=angular.copy(t);return t.length=0,t=[],e},onError:function r(e){if(e.message)this.addAlert({type:"danger",message:e.message,element:e.path});else{var t=e.hasOwnProperty("errors")?e.errors:e.data.errors;angular.forEach(t,r.bind(this))}}}}]).directive("resourcePanel",function(){return{restrict:"E",replace:!0,scope:{index:"&",title:"=",queryId:"="},templateUrl:"views/resource/panel.html"}}).factory("GoogleAnalytics",["$window","$state",function(e,t){var r=function(e){return e.parent?r(t.get(e.parent))+e.url:e.url};return{sendPageView:function(){e.ga("set","page",r(t.current)),e.ga("send","pageview")},sendEvent:function(t,r,o,a){e.ga("send","event",t,r,o,a)}}}]).run(["$rootScope","$state","$stateParams","Formio","FormioAlerts","AppConfig","GoogleAnalytics",function(e,t,r,o,a,n,i){e.company=n.company,e.baseUrl=n.apiUrl,e.dealerLoginForm=n.dealerLoginForm,e.adminLoginForm=n.adminLoginForm,e.contractorLoginForm=n.contractorLoginForm,e.setUser=function(t,r){if(t?(e.user=t,localStorage.setItem("watscoUser",angular.toJson(t))):(e.user=null,localStorage.removeItem("watscoUser")),e.isAdmin=!1,e.isDealer=!1,e.isContractor=!1,!r)return e.role=null,void localStorage.removeItem("watscoRole");switch(e.role=r.toLowerCase(),r){case"dealer":e.isDealer=!0;break;case"contractor":e.isContractor=!0;break;case"admin":e.isAdmin=!0}localStorage.setItem("watscoRole",r)};var s=localStorage.getItem("watscoUser");e.setUser(s?angular.fromJson(s):null,localStorage.getItem("watscoRole")),e.getUrlParams=function(e){return _(e||{}).mapValues(function(e){return"/"+_.escapeRegExp(e)+"/i"}).mapKeys(function(e,t){return"data."+t+"__regex"}).value()},e.getDealer=function(){return e.user?e.isDealer?e.user:e.isContractor?e.user.data.dealer:void 0:{_id:""}},e.getUserName=function(){return e.user&&e.user.data?e.user.data.name||e.user.data.firstName+" "+e.user.data.lastName:""},e.user||o.currentUser().then(function(t){e.setUser(t,localStorage.getItem("watscoRole"))});var m=function(){t.go("auth.contractorlogin"),a.addAlert({type:"danger",message:"Your session has expired. Please log in again."})};e.$on("formio.sessionExpired",m),e.logout=function(){e.setUser(null,null),o.logout().then(function(){t.go("auth.contractorlogin")})["catch"](m)},e.isActive=function(e){return-1!==t.current.name.indexOf(e)},e.authenticated=!!o.getToken(),e.$on("$stateChangeStart",function(r,a){e.authenticated=!!o.getToken(),"auth"!==a.name.substr(0,4)&&((_.startsWith(a.name,"contractor")||_.startsWith(a.name,"dealer"))&&e.isContractor&&(r.preventDefault(),t.go("home",null,{reload:!0})),"home"===a.name&&(r.preventDefault(),t.go("appointments",null,{reload:!0})),e.authenticated||(r.preventDefault(),t.go("auth.contractorlogin")))}),e.$on("$stateChangeSuccess",function(){e.breadcrumbs=[];for(var o in t.$current.path){var n=t.$current.path[o];n["abstract"]&&e.breadcrumbs.push({name:n.name,state:n.name+".view({"+n.name+'Id:"'+r[n.name+"Id"]+'"})'})}e.alerts=a.getAlerts(),i.sendPageView()}),e.$state=t}])}();