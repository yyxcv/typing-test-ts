class Random {

    static pick(items: Array<any>) {
        const i = Math.floor(Math.random() * items.length);
        return items[i];
    }

    static shuffle(array: Array<any>) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            const temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    static int(min: number, max: number) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

}

export default Random;