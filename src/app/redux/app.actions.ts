import { Action } from "@ngrx/store";

export let CART          = '[App] Cart';
export let USER          = '[App] User';
export let USERCABEZA    = '[App] UserCabeza';
export let TOKEN         = '[App] Token';
export let BUSCAR        = '[App] Buscar';
export let CONFIGURACION = '[App] Configuracion';
export let USERPR        = '[App] Userpr';
export let SELECCIONCATEGORIA = '[App] SeleccionCategoria';
export let BUSCADOR      = '[App] Buscador';
export let PRODUCTOHISTORIAL = '[App] Productohistorial';
export let CATEGORIA     = '[App] Categoria';
export let BILLETERA      = '[App] Billetera';

export class CartAction implements Action {
    readonly type = CART;
    constructor( public payload: object,  public opt: string){}
}

export class UserAction implements Action {
    readonly type = USER;
    constructor( public payload: object,  public opt: string){}
}

export class UserCabezaAction implements Action {
    readonly type = USERCABEZA;
    constructor( public payload: object,  public opt: string){}
}

export class TokenAction implements Action {
    readonly type = TOKEN;
    constructor( public payload: object,  public opt: string){}
}

export class BuscarAction implements Action {
    readonly type = BUSCAR;
    constructor( public payload: string,  public opt: string){}
}

export class ConfiguracionAction implements Action {
    readonly type = CONFIGURACION;
    constructor( public payload: object,  public opt: string){}
}

export class UserprAction implements Action {
    readonly type = USERPR;
    constructor( public payload: object,  public opt: string){}
}

export class SeleccionCategoriaAction implements Action {
  readonly type = SELECCIONCATEGORIA;
  constructor( public payload: object,  public opt: string){}
}

export class BuscadorAction implements Action {
  readonly type = BUSCADOR;
  constructor( public payload: object,  public opt: string){}
}
export class ProductoHistorialAction implements Action {
  readonly type = PRODUCTOHISTORIAL;
  constructor( public payload: object,  public opt: string){}
}
export class CategoriaAction implements Action {
    readonly type = CATEGORIA;
    constructor( public payload: object,  public opt: string){}
  }

  export class BilleteraAction implements Action {
    readonly type = BILLETERA;
    constructor( public payload: object,  public opt: string){}
  }
  
export type actions = CartAction         |
                      UserAction         |
                      UserCabezaAction   |
                      TokenAction        |
                      BuscarAction       |
                      UserprAction       |
                      SeleccionCategoriaAction |
                      ConfiguracionAction  |
                      ProductoHistorialAction |
                      CategoriaAction         |
                      BilleteraAction;
