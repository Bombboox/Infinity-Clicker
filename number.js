class Num {
    constructor(value = 0, exponent = 0) {
        this.value = value;
        this.exponent = exponent;
        this.normalize();
    }

    normalize() {
        if(this.value === 0) {
            this.exponent = 0;
            return;
        }

        while(this.value >= 10) {
            this.value /= 10;
            this.exponent++;
        }

        while(this.value < 1 && this.value > 0) {  
            this.value *= 10;
            this.exponent--;
        }
    }
 
    add(other) {
        const result = Num.add(this, other);
        this.value = result.value;
        this.exponent = result.exponent;
    }

    sub(other) {
        const result = Num.add(this, new Num(-other.value, other.exponent));
        this.value = result.value;
        this.exponent = result.exponent;
    }

    mul(other) {
        const result = Num.mul(this, other);
        this.value = result.value;
        this.exponent = result.exponent;
    }

    pow(power) {
        const result = Num.pow(this, power);
        this.value = result.value;
        this.exponent = result.exponent;
    }

    biggerThan(other) {
        return Num.compare(this, other) === this;
    }

    smallerThan(other) {
        return Num.compare(this, other) === other;
    }

    toString() {
        if(this.exponent > 20) {
            return `${this.value.toFixed(2)}e${this.exponent}`;
        } else {
            return (this.value * Math.pow(10, this.exponent)).toFixed(2);
        }
    }

    //lol this doesnt rly work, breaks with negative numbers, fix later dipshit
    static compare(a, b) {
        if (a.value <= 0 && b.value >= 0) return b;
        if (b.value <= 0 && a.value >= 0) return a;
    
        if (a.exponent > b.exponent) {
            return a.value >= 0 ? a : b; 
        } else if (a.exponent < b.exponent) {
            return a.value >= 0 ? b : a;
        } else {
            return a.value >= b.value ? a : b;
        }
    }

    static add(a, b) {
        if(a.exponent > b.exponent + 30) {
            return new Num(a.value, a.exponent);
        }

        if(a.exponent < b.exponent - 30) {
            return new Num(b.value, b.exponent);
        }

        if(a.exponent === b.exponent) {
            return new Num(a.value + b.value, a.exponent);
        }
        
        if(a.exponent > b.exponent) {
            const exponentDiff = a.exponent - b.exponent;
            const adjustedValue = a.value + b.value * Math.pow(10, -exponentDiff);
            return new Num(adjustedValue, a.exponent);
        } else {
            const exponentDiff = b.exponent - a.exponent;
            const adjustedValue = b.value + a.value * Math.pow(10, -exponentDiff);
            return new Num(adjustedValue, b.exponent);
        }
    }

    static mul(a, b) {
        return new Num(a.value * b.value, a.exponent + b.exponent);
    }

    static pow(num, power) {
        if (power.exponent === 0) {
            if (power.value === 0) return new Num(1, 0);
            if (power.value === 1) return new Num(num.value, num.exponent);
        }

        const a = num.value;
        const b = num.exponent;
        const c = power.value;
        const d = power.exponent;

        const exponent = c * 10 ** d * (Math.log10(a) + b);
        const significand = Math.pow(10, exponent % 1);
        return new Num(significand, Math.floor(exponent));
    }
}

function num(value = 0, exponent = 0) {
    return new Num(value, exponent);
}