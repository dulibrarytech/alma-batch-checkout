"use strict";import{ಠ_ಠ605}from"aurelia-framework";import{HttpClient,json}from"aurelia-fetch-client";import{Configuration}from"../../ಠ_ಠ598/Configuration";export class SystemUtils{constructor(ಠ_ಠ595,ಠ_ಠ594){if(this.ಠ_ಠ597=ಠ_ಠ595,this.ಠ_ಠ598=ಠ_ಠ594,void 0!==ಠ_ಠ595){ಠ_ಠ594.session.ಠ_ಠ604;ಠ_ಠ595.configure(ಠ_ಠ595=>{ಠ_ಠ595.withBaseUrl(this.ಠ_ಠ598.ಠ_ಠ606).withDefaults({headers:{Accept:"application/json","client-id-header":this.ಠ_ಠ598.ಠ_ಠ607,"x-access-ಠ_ಠ604":null}})})}this.ಠ_ಠ599=new Spinner({zIndex:2e9,className:"ಠ_ಠ599",top:"350px",left:"50%",shadow:!1,hwaccel:!1,position:"relative"})}doAjax(ಠ_ಠ595,ಠ_ಠ594,ಠ_ಠ609,ಠ_ಠ610){var ಠ_ಠ589={method:ಠ_ಠ594};if("get"==ಠ_ಠ594&&null!=ಠ_ಠ609){var ಠ_ಠ590="?";for(var ಠ_ಠ591 in ಠ_ಠ609)ಠ_ಠ590+=ಠ_ಠ591+"="+ಠ_ಠ609[ಠ_ಠ591]+"&";ಠ_ಠ595+=ಠ_ಠ590.slice(0,-1)}else"get"!=ಠ_ಠ594&&(ಠ_ಠ589.ಠ_ಠ600=json(ಠ_ಠ609));this.ಠ_ಠ597.defaults.headers["x-access-ಠ_ಠ604"]=this.ಠ_ಠ598.session.ಠ_ಠ604;var ಠ_ಠ593=document.getElementById(this.ಠ_ಠ598.ಠ_ಠ612);return ಠ_ಠ593&&(this.startSpinner(),ಠ_ಠ593.appendChild(this.ಠ_ಠ599.ಠ_ಠ613)),this.ಠ_ಠ597.fetch(ಠ_ಠ595,ಠ_ಠ589).then(ಠ_ಠ595=>ಠ_ಠ595.json()).then(ಠ_ಠ595=>(this.stopSpinner(),ಠ_ಠ595))}startSpinner(){this.ಠ_ಠ599.spin()}stopSpinner(){this.ಠ_ಠ599.stop()}sendMessage(ಠ_ಠ595){for(var ಠ_ಠ594=document.getElementsByClassName("message"),ಠ_ಠ609=0;ಠ_ಠ609<ಠ_ಠ594.length;ಠ_ಠ609++)ಠ_ಠ594[ಠ_ಠ609].ಠ_ಠ601=ಠ_ಠ595;setTimeout(function(){for(var ಠ_ಠ595=0;ಠ_ಠ595<ಠ_ಠ594.length;ಠ_ಠ595++)ಠ_ಠ594[ಠ_ಠ595].ಠ_ಠ601=""},3e3)}clearMessages(){for(var ಠ_ಠ595=document.getElementsByClassName("message"),ಠ_ಠ594=0;ಠ_ಠ594<ಠ_ಠ595.length;ಠ_ಠ594++)ಠ_ಠ595[ಠ_ಠ594].ಠ_ಠ601=""}logout(){this.ಠ_ಠ598.session.ಠ_ಠ603={},this.ಠ_ಠ598.session.ಠ_ಠ604="",document.location.reload()}};SystemUtils.ಠ_ಠ605=[HttpClient,Configuration];