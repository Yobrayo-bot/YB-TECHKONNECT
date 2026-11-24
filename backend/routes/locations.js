
const express = require('express')
const router = express.Router()

const { CountryStateCity } = require('@tansuasici/country-state-city')

// GET all countries
router.get('/countries', (req, res) => {
  try {
    const countries = CountryStateCity.getAllCountries()
      .map(country => ({
        id: country.id,
        name: country.name,
        iso2: country.iso2,
        iso3: country.iso3,
        emoji: country.emoji
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

    res.json({
      success: true,
      count: countries.length,
      countries
    })
  } catch (error) {
    console.error('Fetch countries error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to retrieve countries.'
    })
  }
})

// GET regions/states/provinces for a country
router.get('/countries/:countryCode/regions', (req, res) => {
  try {
    const countryCode = req.params.countryCode.toUpperCase()

    const country = CountryStateCity.getCountryByIso2(countryCode)

    if (!country) {
      return res.status(404).json({
        success: false,
        message: 'Country not found.'
      })
    }

    const regions = CountryStateCity
      .getStatesByCountryCode(countryCode)
      .map(region => ({
        id: region.id,
        name: region.name
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

    res.json({
      success: true,
      count: regions.length,
      regions
    })
  } catch (error) {
    console.error('Fetch regions error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to retrieve regions.'
    })
  }
})

// GET cities for a selected region
router.get('/regions/:regionId/cities', (req, res) => {
  try {
    const regionId = Number(req.params.regionId)

    if (!Number.isSafeInteger(regionId) || regionId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid region ID.'
      })
    }

    const region = CountryStateCity.getStateById(regionId)

    if (!region) {
      return res.status(404).json({
        success: false,
        message: 'Region not found.'
      })
    }

    const cities = CountryStateCity
      .getCitiesByStateId(regionId)
      .map(city => ({
        id: city.id,
        name: city.name
      }))
      .sort((a, b) => a.name.localeCompare(b.name))

    res.json({
      success: true,
      count: cities.length,
      cities
    })
  } catch (error) {
    console.error('Fetch cities error:', error.message)

    res.status(500).json({
      success: false,
      message: 'Unable to retrieve cities.'
    })
  }
})

module.exports = router