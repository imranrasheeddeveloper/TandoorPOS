import React, { useEffect, useState } from 'react';
import {useFormikContext} from 'formik';
import AppTextInput from '../AppTextInput';
import ErrorMessage from './ErrorMessage';
function AppFormField({name, lang,  width, ...otherProps}) {
    const {setFieldTouched, handleChange, errors, touched} = useFormikContext();
    return (
        <>
        <AppTextInput 
            onBlur={()=> setFieldTouched(name)}
            onChangeText={handleChange(name)}
            {...otherProps}
            width={width}
            lang={lang}
        />
        <ErrorMessage error={errors[name]} style={{alignSelf:  lang === 'en'? 'flex-start': 'flex-end'}} visible={touched[name]} />
        </>
    );
}

export default AppFormField;