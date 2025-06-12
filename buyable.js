class Buyable {
    constructor(options = {name, basePrice, costExponent, level, type}) {
        this.name = options.name ?? "Man";
        this.basePrice = options.basePrice ?? new Num(1, 0); 
        this.costExponent = options.costExponent ?? new Num(1.07, 0);  

        const logEfficiencyExponent = Math.log10(5); // ≈ 0.69897
        const calculatedBaseValue = Num.mul(
            new Num(0.1, 0), 
            Num.pow(this.basePrice, new Num(logEfficiencyExponent, 0))
        );

        this.baseValue = options.baseValue ?? calculatedBaseValue;
    
        this.level = options.level ?? new Num(0, 0);
        this.price = new Num(0, 0);
        this.type = options.type ?? "idle";
        this.value = new Num(0, 0);

        this.updatePrice();
        this.updateValue();
    }

    upgrade(money, numLevels = 1) {
        if(money.biggerThan(this.getPrice(numLevels - 1))) {
            money.sub(this.getPrice(numLevels - 1));
            this.level = Num.add(this.level, new Num(numLevels, 0));
            this.updatePrice();
            this.updateValue();
            return true;
        }
        return false;
    }

    getPrice(upgrades = 0) {
        const levelExponentiated = Num.pow(this.costExponent, Num.add(this.level, new Num(upgrades, 0)));
        const price = Num.mul(this.basePrice, levelExponentiated); 
        return price;
    }

    getValue() {
        var value = Num.mul(this.baseValue, this.level);
        if(this.type === "click") {
            if(this.level.smallerThan(new Num(200, 0))) { 
                value = Num.mul(value, new Num(10, 0));
            } else {
                const extra = Num.mul(this.baseValue, num(30));
                value.add(extra);
            }
        } 
        return value;
    }

    updateValue() {
        this.value = this.getValue();
    }

    updatePrice() {
        this.price = this.getPrice();
    }
}