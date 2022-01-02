import { genKeyPairAndSeed, genKeyPairFromSeed } from "@skynetlabs/skynet-nodejs";
import { decrypt, encrypt } from "./encrypt"

describe('Encrypt', () => {
    test('encrypt/descrypt', async () => {
        const {seed} = genKeyPairAndSeed()
        const { publicKey, privateKey } = genKeyPairFromSeed(seed)
        
        const originalJSON = {
            "glossary": {
                "title": "example glossary",
                "GlossDiv": {
                    "title": "S",
                    "GlossList": {
                        "GlossEntry": {
                            "ID": "SGML",
                            "SortAs": "SGML",
                            "GlossTerm": "Standard Generalized Markup Language",
                            "Acronym": "SGML",
                            "Abbrev": "ISO 8879:1986",
                            "GlossDef": {
                                "para": "A meta-markup language, used to create markup languages such as DocBook.",
                                "GlossSeeAlso": ["GML", "XML"]
                            },
                            "GlossSee": "markup"
                        }
                    }
                }
            }
        }

        const encrypted = encrypt(originalJSON, privateKey)
        const decrypted = decrypt(encrypted, privateKey)

        expect(decrypted).toStrictEqual(originalJSON)
    })
})