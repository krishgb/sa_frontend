export const trie = () => {
    const ds = new Map()
    ds.set('root', new Map())

    return {
        insert:(words, idx) => {
            const ins = (word) => {
                let node = ds.get('root')
            
                let prev = node
                
                for(let letter of word) {
                    if(!prev.has(letter)) {
                        prev.set(letter, new Map())
            
                        prev.get(letter).set('index', new Set([idx]))
                        prev.get(letter).set('next', new Map())
                    }else{
                        prev.get(letter).get('index').add(idx)
                    }
                    prev = prev.get(letter).get('next')
                }
            }
            for(let word of words.split(' ')) ins(word)
            ins(words)
            
        },
        search: (word) => {
            let m = ds.get('root')
            let prev = null
            for(let i = 0; i < word.length; i++) {
                const letter = word[i]
                if(m.has(letter)) {
                    prev = m
                    if(i === word.length - 1) {
                        return [...m.get(letter).get('index')]
                    }
                    m = m.get(letter).get('next')
                }else{
                    return []
                }
            }
            return []
        }
    }
}