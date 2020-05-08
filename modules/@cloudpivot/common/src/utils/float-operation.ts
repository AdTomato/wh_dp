export abstract class Operation {
    /**
     * 加
     * @param num1 
     * @param num2 
     */
    static add(num1,num2) {
        const num1L = getFloatNumLength(num1);
        const num2L = getFloatNumLength(num2);
        const  m = Math.pow(10,Math.max(num1L, num2L));
        return Math.round(num1*m+num2*m)/m;
    }
    /**
     * 减
     * @param num1 
     * @param num2 
     */
    static sub(num1,num2) {
        const num1L = getFloatNumLength(num1);
        const num2L = getFloatNumLength(num2);
        const m = Math.pow(10,Math.max(num1L,num2L));
        const n = (num1L>= num2L) ? num1L : num2L;
        return (Math.round(num1*m-num2*m)/m).toFixed(n);
    }
    /**
     * 相除
     * @param num1 
     * @param num2 
     */
    static divided(num1,num2){
        var t1,t2,r1,r2;
        t1 = getFloatNumLength(num1);
        t2 = getFloatNumLength(num2);
        r1 = Number(num1.toString().replace(".",""));
        r2 = Number(num2.toString().replace(".",""));
        return (r1/r2)*Math.pow(10,t2-t1);
    }

    /**
     * 乘
     * @param num1 
     * @param num2 
     */
    static multiplication(num1,num2) {
        const num1L = getFloatNumLength(num1);
        const num2L = getFloatNumLength(num2);
        const  m = num1L + num2L;
        var s1= num1.toString();
        var s2=num2.toString(); 
        return Number(s1.replace(".",""))*Number(s2.replace(".",""))/Math.pow(10,m);
    }
}

export function getFloatNumLength(num:number):number {
    try {
       return num.toString().split('.')[1].length;
    }catch(e){
        return 0;
    }
}

