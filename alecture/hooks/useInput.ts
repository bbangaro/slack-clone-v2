import React, { Dispatch, SetStateAction, useCallback, useState } from 'react';

// <T = any>(initialData: T): [T, (e: any) => void, Dispatch<SetStateAction<T>>]
//          매개변수         : return type
//                            너무 기니까 아래처럼 변수로 빼기
type ReturnTypes<T = any> = [T, (e: any) => void, Dispatch<SetStateAction<T>>];

const useInput = <T = any>(initialData: T): ReturnTypes<T> => {
    const [value, setValue] = useState(initialData);
    
    const handler = useCallback((e: any) => {
        setValue(e.target.value);
    }, []);

    return [value, handler, setValue];
};

export default useInput;

// handler 타입지정 (any 안 쓸 경우)
// React.ChangeEvent<HTMLInputElement>,
// e.target.value as unknown as T 
// as 가능한 형변환은 any 나 unknown
// string boolean number 등은 unknown으로 형변환 가능.
// 그래서 먼저 unknown으로 바꾸고 원하는 타입<T>로 바꿔준 거임