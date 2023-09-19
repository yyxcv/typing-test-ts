import {selectCharacters} from "../lib/redux";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import CharLookup from "../classes/CharLookup";

export default function useCharLookup() {

    const characters = useSelector(selectCharacters);
    const [charLookup, setCharLookup] = useState<CharLookup>(new CharLookup(characters));

    useEffect(() => {
        setCharLookup(new CharLookup(characters))
    }, [characters]);

    return charLookup;
}