
import * as _action from './app.actions';
import * as _ from 'lodash';
import { STORAGES } from '../interfaces/sotarage';

let APP = dropt();
let data:any;
function dropt(){
  let data_stora:STORAGES = {};
  return data_stora;
}
export function appReducer(state: STORAGES = APP, action: _action.actions) {
  if(JSON.parse(localStorage.getItem('APP'))) {
    state = JSON.parse(localStorage.getItem('APP'));
    validacion_key(state);
  }
  else {
    localStorage.removeItem('APP');
    localStorage.setItem('APP', JSON.stringify(state));
  }
  // console.log(state);
  function local_Storage(APP){
    localStorage.removeItem('APP');
    localStorage.setItem('APP', JSON.stringify(APP));
    state = JSON.parse(localStorage.getItem('APP'));
    return state
  }
  function proceso_data(lista:any, data:any, opt){
    let idx = _.findIndex(lista, ['id', data.id]);
    if(idx >-1){
      if(opt === 'delete') lista.splice(idx, 1);
      else lista[idx]= data;
    }else{
      if(opt === 'post') lista.push(data);
    }
    return lista;
  }
  function validacion_key(state: STORAGES){
    //if(!state.articulos) state.articulos = [];
    if(!state.cart) state.cart = [];
    if(!state.user) state.user = {};
    if(!state.usercabeza) state.usercabeza = {};
  }
  switch (action.type) {
    case _action.CART:{
      switch (action.opt){
        case 'post': {
          // console.log(action.payload);
          if(!state.cart) state.cart = [];
          data = proceso_data(state.cart,action.payload, 'post');
          state.cart = data;
          return local_Storage(state);
        }
        break;
        case 'put': {
          data = proceso_data(state.cart,action.payload, 'put');
          state.cart = data;
          return local_Storage(state);
        }
        break;
        case 'delete': {
          data = proceso_data(state.cart,action.payload, 'delete');
          state.cart = data;
          return local_Storage(state);
        }
        break;
        case 'drop': {
          state.cart = [];
          return local_Storage(state);
        }
        break;
        default:
        return local_Storage(state);
        break;
      }
    }
    case _action.USER: {
      switch(action.opt) {
        case 'post' :
          if(!state.user) state.user = {};
            state.user = action.payload;
            return local_Storage(state);
        break;
        case 'put': {
          state.user = action.payload;
        }
        return local_Storage(state);
        break;
        case 'delete': 
          state.user = {};
          return local_Storage(state);
        break;
        case 'drop': {
          state.user = {};
          return local_Storage(state);
        }
        break;
      }
    }
    case _action.USERCABEZA: {
      switch(action.opt) {
        case 'post' :
          if(!state.usercabeza) state.usercabeza = {};
            state.usercabeza = action.payload;
            return local_Storage(state);
        break;
        case 'put': {
          state.usercabeza = action.payload;
        }
        return local_Storage(state);
        break;
        case 'delete': 
          state.usercabeza = {};
          return local_Storage(state);
        break;
        case 'drop': {
          state.usercabeza = {};
          return local_Storage(state);
        }
        break;
      }
    }
    case _action.TOKEN: {
      switch(action.opt) {
        case 'post' :
          if(!state.token) state.token = {};
            state.token = action.payload;
            return local_Storage(state);
        break;
        case 'put': {
          state.token = action.payload;
        }
        return local_Storage(state);
        break;
        case 'delete': 
          state.token = {};
          return local_Storage(state);
        break;
        case 'drop': {
          state.token = {};
          return local_Storage(state);
        }
        break;
      }
    }
    case _action.BUSCAR: {
      switch(action.opt) {
        case 'post' :
          if(!state.buscar) state.buscar = "";
            state.buscar = action.payload;
            return local_Storage(state);
        break;
        case 'put': {
          state.buscar = action.payload;
        }
        return local_Storage(state);
        break;
        case 'delete': 
          state.buscar = "";
          return local_Storage(state);
        break;
        case 'drop': {
          state.buscar = "";
          return local_Storage(state);
        }
        break;
      }
    }
    case _action.CONFIGURACION:{
      switch(action.opt) {
        case 'post' :
          if(!state.configuracion) state.configuracion = {};
            state.configuracion = action.payload;
            return local_Storage(state);
        break;
        case 'put': {
          state.configuracion = action.payload;
        }
        return local_Storage(state);
        break;
        case 'delete': 
          state.configuracion = {};
          return local_Storage(state);
        break;
        case 'drop': {
          state.configuracion = {};
          return local_Storage(state);
        }
        break;
      }
    }
    case _action.USERPR: {
      switch(action.opt) {
        case 'post' :
          if(!state.userpr) state.userpr = {};
            state.userpr = action.payload;
            return local_Storage(state);
        break;
        case 'put': {
          state.userpr = action.payload;
        }
        return local_Storage(state);
        break;
        case 'delete': 
          state.userpr = {};
          return local_Storage(state);
        break;
        case 'drop': {
          state.userpr = {};
          return local_Storage(state);
        }
        break;
      }
    }
    
    /*case _action.ARTICULOS:{
      switch (action.opt){
        case 'post': {
          // console.log(action.payload);
          if(!state.articulos) state.articulos = [];
          data = proceso_data(state.articulos,action.payload, 'post');
          state.articulos = data;
          return local_Storage(state);
        }
        break;
        case 'put': {
          data = proceso_data(state.articulos,action.payload, 'put');
          state.articulos = data;
          return local_Storage(state);
        }
        break;
        case 'delete': {
          data = proceso_data(state.articulos,action.payload, 'delete');
          state.articulos = data;
          return local_Storage(state);
        }
        break;
        case 'drop': {
          state.articulos = [];
          return local_Storage(state);
        }
        break;
        default:
        return local_Storage(state);
        break;
      }
    }
    break;*/
    default: return state;
  }
}
