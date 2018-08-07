import MODIFIERS from './modifiers';

export default function convertModifiersToIntCode (modifiers) {
    let result = 0;

    Object.keys(modifiers).forEach(key => {
        result |= modifiers[key] ? MODIFIERS[key] : 0;
    });

    return result;
}
