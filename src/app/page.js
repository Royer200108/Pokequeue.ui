"use client"

import { useState, useEffect, useRef } from "react"
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

import { Input } from "@/components/ui/input"

import PokemonTypeSelector from "@/components/pokemon-type-selector"
import ReportsTable from "@/components/reports-table"
import { getPokemonTypes, getPokemonByType } from "@/services/pokemon-service"
import { getReports, createReport, deleteReport } from "@/services/report-service"

export default function PokemonReportsPage() {
  const [pokemonTypes, setPokemonTypes] = useState([])
  const [reports, setReports] = useState([])
  const [loadingTypes, setLoadingTypes] = useState(true)
  const [loadingReports, setLoadingReports] = useState(true)
  const [creatingReport, setCreatingReport] = useState(false)
  const [error, setError] = useState(null)
  const [selectedType, setSelectedType] = useState("")

  const [pokemonByType, setPokemonByType] = useState(0)
  const [inputValue, setInputValue] = useState("")

  // Referencia al input para vaciar el contenido
  const inputRef = useRef(null);

  // Cargar los tipos de Pokémon
  useEffect(() => {
    const loadPokemonTypes = async () => {
      try {
        setLoadingTypes(true)
        setError(null)
        const types = await getPokemonTypes()
        setPokemonTypes(types)
        setLoadingTypes(false)
      } catch (error) {
        console.error("Error loading Pokemon types:", error)
        setError("Error al cargar los tipos de Pokémon. Por favor, intenta de nuevo más tarde.")
        setLoadingTypes(false)
      }
    }

    loadPokemonTypes()
  }, [])

  // Función para cargar los reportes
  const loadReports = async () => {
    try {
      setLoadingReports(true)
      setError(null)
      const reportData = await getReports()
      setReports(reportData)
      setLoadingReports(false)
      return reportData
    } catch (error) {
      console.error("Error loading reports:", error)
      setError("Error al cargar los reportes. Por favor, intenta de nuevo más tarde.")
      setLoadingReports(false)
      throw error
    }
  }

  // Función para refrescar la tabla
  const handleRefreshTable = async () => {
    try {
      await loadReports()
      return true
    } catch (error) {
      throw error
    }
  }

  // Cargar los reportes al iniciar
  useEffect(() => {
    loadReports()
  }, [])

  // Función para capturar todos los Pokémon del tipo seleccionado
  const catchThemAll = async () => {
    if (!selectedType) return

    try {
      setCreatingReport(true)

      // Crear un nuevo reporte usando la API
      await createReport(selectedType, inputValue)

      // Mostrar notificación de éxito
      toast.success(`Se ha generado un nuevo reporte para el tipo ${selectedType}.`)

      //Limpia el tipo de pokémon seleccionado y el input
      setInputValue("")
      setSelectedType("")
      handleButtonClick()

      // Refrescar la tabla para mostrar el nuevo reporte
      await loadReports()

      setCreatingReport(false)
    } catch (error) {
      console.error("Error creating report:", error)

      // Mostrar notificación de error
      toast.error("No se pudo crear el reporte. Por favor, intenta de nuevo.")

      setCreatingReport(false)
    }
  }

  // Función para descargar el CSV
  const handleDownloadCSV = (url) => {
    window.open(url, "_blank")
  }

  // Función para eliminar el reporte
  const handleDeleteReport = async (id) => {
    // Add logic to delete the report by id
    console.log(`Deleting report with id: ${id}`)

    //Elimina el reporte usando la API
    await deleteReport(id)

    //Recarga la tabla de reportes
    await loadReports()
  }

  // Función para obtener el número máximo de Pokémon por tipo
  useEffect(() => {
    const fetchPokemonByType = async () => {
      if (selectedType) {
        const count = await getPokemonByType(selectedType)
        setPokemonByType(count)
        console.log("Número máximo de Pokémon por tipo:", count)
      } else {
        setPokemonByType(0)
      }
    }

    fetchPokemonByType()
  }, [selectedType])

  const handleButtonClick = () => {
    // Limpiar el valor directamente en el DOM
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const isLoading = loadingTypes || loadingReports

  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold">Pokémon Reports Generator</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/*Contiene la primera parte del formulario (Seleccion de tipos y boton de catch) */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-2/3 flex flex-row space-between">
              <PokemonTypeSelector

                pokemonTypes={pokemonTypes}
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                loading={loadingTypes}

              />

              <Input
                ref={inputRef}
                type="number"
                min="1"
                max={pokemonByType}
                onKeyDown={(e) => {
                  const isNumberKey = /^\d+$/.test(e.key);
                  const isControlKey = [
                    "Backspace",
                    "ArrowLeft",
                    "ArrowRight",
                    "Delete",
                  ].includes(e.key);

                  if (!isNumberKey && !isControlKey) {
                    e.preventDefault();
                  }
                }}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  const value = e.target.value;
                  if (value > pokemonByType) {
                    e.target.value = pokemonByType;
                    setInputValue(pokemonByType)
                  }
                }}
                onPaste={(e) => {
                  const text = e.clipboardData.getData("text");
                  if (!/^\d+$/.test(text)) {
                    e.preventDefault();
                  }
                }}
                placeholder={"El número máximo de registros es " + pokemonByType}
                disabled={!selectedType}
                required
              />
              <p className={inputValue > pokemonByType ? "text-red-500" : "hidden"}>
                {inputValue} El número máximo de Pokémon por tipo es {pokemonByType}

              </p>

              <span className="validity"></span>
            </div>
            <div className="w-full md:w-1/3">
              <Button
                onClick={catchThemAll}
                disabled={!selectedType || isLoading || creatingReport || inputValue <= 0}
                className="w-full font-bold"

              >
                {creatingReport ? "Creating..." : isLoading ? "Loading..." : "Catch them all!"}
              </Button>
            </div>
          </div>
          {/**Contiene la segunda parte del formulario (la tabla de reportes) */}
          <ReportsTable
            reports={reports}
            loading={loadingReports}
            onRefresh={handleRefreshTable}
            onDownload={handleDownloadCSV}
            onDelete={handleDeleteReport}
          />
        </CardContent>
      </Card>



    </div >
  )
}