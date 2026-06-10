const REFS_PLACEHOLDER_REGEX = /\{\{(spec|docs|github|llmsFiles|robotsTxt)\.([\w.]+)\}\}/g


const replaceRefsPlaceholders = ( { template, refs } ) => {
    const result = template.replace( REFS_PLACEHOLDER_REGEX, ( match, root, dotPath ) => {
        const value = dotPath.split( '.' ).reduce( ( acc, key ) => {
            if( acc === undefined || acc === null ) return undefined
            return acc[ key ]
        }, refs[ root ] )
        if( value === undefined || value === null ) {
            throw new Error( `Refs-Placeholder ohne Match in refs.json: ${ match }` )
        }
        return String( value )
    } )

    const leftover = result.match( REFS_PLACEHOLDER_REGEX )
    if( leftover !== null ) {
        throw new Error( `Refs-Placeholders nach Replace verblieben: ${ leftover.join( ', ' ) }` )
    }

    return result
}


export { replaceRefsPlaceholders }
