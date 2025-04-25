/**
 * Obtiene todos los tipos de Pokémon desde la PokeAPI
 * @returns {Promise<Array>} Array con los tipos de Pokémon
 */
export async function getPokemonTypes() {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/type")

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }

    const data = await response.json()
    return data.results
  } catch (error) {
    console.error("Error fetching Pokemon types:", error)
    throw error
  }
}

// Función para obtener la cantidad de los Pokémon de un tipo específico
export async function getPokemonByType(pokemon_type) {
  try {
    const response = await fetch("https://pokeapi.co/api/v2/type/" + pokemon_type)

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`)
    }
    const data = await response.json()
    return (data.pokemon.length)
  } catch (error) {
    console.error("Error fetching Pokemon types:", error)
    throw error
  }
}