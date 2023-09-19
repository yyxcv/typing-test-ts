import {TypingTestState} from "@/src/lib/redux";

interface Lookup {
    records: TypingTestState['characters'],
    charToId: { [key: string]: string },
    charIdToRecordId: { [key: string]: number }
}

export default class CharLookup {

    lookup: Lookup = {
        records: [],
        charToId: {},
        charIdToRecordId: {},
    };

    constructor(characters: TypingTestState['characters']) {
        const chars = JSON.parse(JSON.stringify(characters));
        this._sort(chars);
        this.lookup.records = chars;
        for (let item of chars) {
            for (let char of item.characters.split('')) {
                this.lookup.charToId[char] = item.id;
            }
        }
        for (let i = 0; i < chars.length; i++) {
            this.lookup.charIdToRecordId[chars[i].id] = i;
        }
    }

    _sort(characters: TypingTestState['characters']) {
        characters.sort((a, b) => {
            const rankA = this._charClassRank(a.class);
            const rankB = this._charClassRank(b.class);
            if (rankA < rankB) {
                return -1;
            } else if (rankA > rankB) {
                return 1;
            } else {
                const displayA = a.display_string ? a.display_string : a.characters[0];
                const displayB = b.display_string ? b.display_string : b.characters[0];
                if (displayA < displayB) {
                    return -1;
                } else if (displayA < displayB) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });
    }

    _charClassRank(charClass: string) {
        switch (charClass) {
            case 'SPACE':
                return 0;
            case 'NUMBER':
                return 1;
            case 'LETTER':
                return 2;
            case 'SPECIAL':
                return 3;
            case 'CONTROL':
                return 4;
            case 'MODIFIER':
                return 5;
            case 'NUMPAD':
                return 6;
            default:
                return 7;
        }
    }

    isUpperCase(char: string) {
        return 'ABCDEFGHIJKLMNOPQRSTUVWXYZÖÄÜ'.includes(char);
    }

    recordById(id: string) {
        const recordId = this.lookup.charIdToRecordId[id];
        return this.lookup.records[recordId];
    }

    recordByChar(char: string) {
        return this.recordById(this.idByChar(char));
    }

    representativeById(id: string) {
        const recordId = this.lookup.charIdToRecordId[id];
        return this.lookup.records[recordId].characters[0];
    }

    hasMultiCharRepresentation(char: string) {
        const record = this.recordByChar(char);
        return (['CONTROL', 'MODIFIER'].includes(record.class) || record.id === 'NumLock') && this.displayStringByChar(char) !== char
    }

    idByChar(char: string) {
        if (this.lookup.charToId.hasOwnProperty(char)) {
            return this.lookup.charToId[char];
        }
        throw new Error(`char '${char}' not found in char-list`)
    }

    displayStringByChar(char: string) {
        const charId = this.idByChar(char);
        const record = this.recordById(charId);
        return record.hasOwnProperty("display_string") && record.display_string !== null ? JSON.parse(`"${record.display_string}"`) : char;
    }

    records() {
        return this.lookup.records;
    }

    charTypeById(charId: number) {
        const recordId = this.lookup.charIdToRecordId[charId];
        return this.lookup.records[recordId].class;
    }

    charIdsWithActivityInfo(activeCharIds: Array<string>) {
        const charIds = this.records().map((el) => el.id);
        const info: { [key: string]: boolean } = {};
        for (const id of charIds) {
            info[id] = activeCharIds.includes(id);
        }
        return info;
    }

    charIsTypedWithModifierShift(char: string) {
        const record = this.recordByChar(char);
        return (record.has_uppercase && char !== char.toLowerCase()) || record.modifier_shift;
    }
}