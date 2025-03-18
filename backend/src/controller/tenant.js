const express = require("express");
const Tenant = require("../models/Tenant");
const Token = require("../models/Token");
const axios = require('axios');

const currencyAPIKey = process.env.CURRENCY_API_KEY;
const COINGECKOAPIKey = process.env.COIN_API_KEY;
const COINMARKETCAP_URL = 'https://sandbox-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest';
const CURRENCY_LAYER_URL = 'https://api.currencylayer.com/live';


exports.createTenant = async (req, res) => {
  try {
    const userId = req.user.userId; // Extracted from authentication token

    const tenantData = { ...req.body, userId };
    const newTenant = new Tenant(tenantData);
    await newTenant.save();

    res.status(201).json({ message: "Tenant profile created successfully", tenant: newTenant });
  } catch (error) {
    console.error("Error creating tenant profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 📌 Get All Tenants of Logged-in User
exports.getAllTenants = async (req, res) => {
  try {
    const userId = req.user.id; // Extract userId from authenticated user
    const tenants = await Tenant.find(); // Fetch only the tenants belonging to this user

    res.status(200).json({ success: true, tenants });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};


// 📌 Get Tenant by ID
exports.getTenantById = async (req, res) => {
  try {
    const { id } = req.params;
    const tenant = await Tenant.findById(id);

    if (!tenant) {
      return res.status(404).json({ success: false, message: "Tenant not found" });
    }

    res.status(200).json({ success: true, tenant });
  } catch (error) {
    res.status(500).json({ success: false, error: "Invalid Tenant ID" });
  }
};



const convertToEuro = async (amount, fromCurrency, to) => {
  try {
    const endpoint = 'convert'
    const url = `https://api.currencylayer.com/${endpoint}?access_key=${currencyAPIKey}&from=${fromCurrency}&to=${to}&amount=${amount}`;
    const response = await axios.get(url);
    if (response.data.success) {
      console.log("Converted Amount:", response.data.result);
      return response.data.result;
    } else {
      console.log("Error:", response.data.error.info);
    }
  } catch (error) {
    console.error("API Request Failed:", error.message);
  }
};

const convertEuroToUSDC = async (euroAmount) => {
  try {
    const usdAmount = euroAmount;

    // Step 2: Get USDC to USD exchange rate
    const usdcResponse = await axios.get(COINMARKETCAP_URL, {
        headers: {
            'X-CMC_PRO_API_KEY': COINGECKOAPIKey
        },
        params: {
            symbol: 'USDC',
            convert: 'USD'
        }
    });

    if (usdcResponse.data.status.error_code !== 0) {
        console.log("CoinMarketCap Error:", usdcResponse.data.status.error_message);
        return null;
    }

    const usdcToUsdRate = usdcResponse.data.data.USDC.quote.USD.price;
    console.log(`1 USDC = ${usdcToUsdRate} USD`);

    // Convert USD to USDC
    const usdcAmount = usdAmount / usdcToUsdRate;
    console.log(usdAmount, usdcAmount);

    return usdcAmount;
} catch (error) {
    console.error("Conversion Failed:", error.message);
    return null;
}
};


exports.getPayableAmount = async (req, res) => {
  try {
    const { tenantId, rentAmount, plan, currency } = req.body;

    const tenant = await Tenant.findById(tenantId);

    if (!tenantId || !rentAmount || !plan || !currency) {
      return res.status(400).json({ success: false, message: "Missing required fields." });
    }

    // Step 1: Convert to EUR
    const rentInEuro = await convertToEuro(rentAmount, currency.toUpperCase(), "USD");

    // Step 2: Apply Plan Percentage
    const planPercentage = parseFloat(plan) / 100;
    const planAmount = rentInEuro * planPercentage;

    // Step 3: Convert to USDC
    const usdcAmount = await convertEuroToUSDC(planAmount);

    tenant.payableAmount = usdcAmount.toFixed(2);
    await tenant.save();

    res.status(200).json({
      success: true,
      rentAmount,
      convertedRent: rentInEuro.toFixed(2),
      planPercentage: `${plan}%`,
      planAmount: planAmount.toFixed(2),
      payableAmount: usdcAmount.toFixed(2),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


function calculateTokens(dailyRent, tokenPrice, planPercentage) {
  let tokensPerDay = (dailyRent * (planPercentage / 100)) / tokenPrice;
  let tokensPerMonth = tokensPerDay * 30;  // Approximate month
  let tokensPerYear = tokensPerDay * 365;  // Full year
  
  return { tokensPerDay, tokensPerMonth, tokensPerYear };
}




exports.getReward = async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Validate input
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Missing required tenantId.",
      });
    }

    // Fetch tenant details
    const tenant = await Tenant.findById(tenantId);
    if (!tenant) {
      return res.status(404).json({
        success: false,
        message: "Tenant not found.",
      });
    }

    // Extract necessary fields
    const { rentPerDay, planPercentage } = tenant;

    const tokenPrice = 0.5;

    // Calculate rewards
    const rewards = calculateTokens(rentPerDay, tokenPrice, planPercentage);

    const { tokensPerDay } = rewards;

    // Save to Token model
    const tokenRecord = await Token.create({
      tenantId,
      dailyTokens: tokensPerDay,
    });

    // Standardized response format
    return res.status(200).json({
      success: true,
      message: "Reward calculation successful.",
      data: rewards, // Returns tokensPerDay, tokensPerMonth, tokensPerYear
    });

  } catch (error) {
    console.error("Error in getReward:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }

};


exports.getAllToken = async (req, res) => {
  try {
    const { tenantId } = req.params;

    // Validate input
    if (!tenantId) {
      return res.status(400).json({
        success: false,
        message: "Missing required tenantId.",
      });
    }

    // Fetch tokens for the tenant
    const tokens = await Token.find({ tenantId });

    if (!tokens || tokens.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No tokens found for this tenant.",
      });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "Tokens retrieved successfully.",
      data: tokens,
    });
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};