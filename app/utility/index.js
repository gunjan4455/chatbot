import React from 'react';

export const emailValidator = (email) => {
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (reg.test(email) == false) {
        return false;
    }
    return true;
}


export const updateScroll=()=>{
    var element1 =document.getElementsByClassName("messages-container");
    element1[0].scrollTop = element1[0].scrollHeight;
}
