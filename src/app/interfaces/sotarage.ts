export interface STORAGES {
    cart?: CART[];
    user?: USER;
    usercabeza?: USERCABEZA;
    token?: TOKEN;
    buscar?: BUSCAR;
    configuracion?: CONFIGURACION;
    userpr?: USERPR;
    categoria?: CATEGORIA
    billetera?: BILLETERA;
};

export interface CATEGORIA{

}

export interface USERPR{

}

export interface DataTable {
    headerRow: string[];
    footerRow: string[];
    dataRows: any[][];
  }

export interface CONFIGURACION{

}

export interface BUSCAR {
    
}

export interface TOKEN {
    
}

export interface CART{

};

export interface USER{

};

export interface USERCABEZA{
    
}

export interface BILLETERA{

}