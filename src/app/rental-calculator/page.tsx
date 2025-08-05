'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { Calculator, DollarSign, Home, TrendingUp, Info, AlertCircle, CheckCircle } from 'lucide-react';

interface CalculationResult {
  monthlyRent: number;
  annualRent: number;
  utilities: number;
  insurance: number;
  totalMonthly: number;
  totalAnnual: number;
  affordabilityScore: number;
  recommendations: string[];
}

interface AffordabilityResult {
  maxRent: number;
  recommendedRent: number;
  monthlyIncome: number;
  debtToIncomeRatio: number;
  isAffordable: boolean;
  warnings: string[];
}

export default function RentalCalculator() {
  const [activeTab, setActiveTab] = useState<'rental-cost' | 'affordability' | 'investment'>('rental-cost');
  const [calculationResult, setCalculationResult] = useState<CalculationResult | null>(null);
  const [affordabilityResult, setAffordabilityResult] = useState<AffordabilityResult | null>(null);

  // Rental Cost Calculator State
  const [rentalCosts, setRentalCosts] = useState({
    baseRent: '',
    utilities: '',
    internet: '',
    parking: '',
    petFee: '',
    securityDeposit: '',
    applicationFee: '',
    insurance: ''
  });

  // Affordability Calculator State
  const [affordabilityInputs, setAffordabilityInputs] = useState({
    monthlyIncome: '',
    monthlyDebts: '',
    savings: '',
    creditScore: '',
    employmentType: 'full-time'
  });

  // Investment Calculator State
  const [investmentInputs, setInvestmentInputs] = useState({
    propertyValue: '',
    monthlyRent: '',
    propertyTax: '',
    insurance: '',
    maintenance: '',
    propertyManagement: '',
    vacancyRate: '',
    mortgagePayment: ''
  });

  const calculateRentalCost = () => {
    const costs = {
      baseRent: parseFloat(rentalCosts.baseRent) || 0,
      utilities: parseFloat(rentalCosts.utilities) || 0,
      internet: parseFloat(rentalCosts.internet) || 0,
      parking: parseFloat(rentalCosts.parking) || 0,
      petFee: parseFloat(rentalCosts.petFee) || 0,
      securityDeposit: parseFloat(rentalCosts.securityDeposit) || 0,
      applicationFee: parseFloat(rentalCosts.applicationFee) || 0,
      insurance: parseFloat(rentalCosts.insurance) || 0
    };

    const monthlyRent = costs.baseRent;
    const annualRent = monthlyRent * 12;
    const utilities = costs.utilities + costs.internet;
    const insurance = costs.insurance;
    const totalMonthly = monthlyRent + utilities + insurance + costs.parking + (costs.petFee / 12);
    const totalAnnual = totalMonthly * 12;

    // Calculate affordability score based on Ontario 2025 market realities
    // Ontario average rent is around $2,200-2,800 for 1-2 bedroom units
    const baseScore = 100;
    let deductions = 0;
    
    if (totalMonthly > 3500) {
      deductions += 40; // Very expensive for Ontario
    } else if (totalMonthly > 2800) {
      deductions += 25; // Above average but manageable
    } else if (totalMonthly > 2200) {
      deductions += 10; // Average Ontario rent
    } else if (totalMonthly > 1800) {
      deductions += 5; // Below average - good deal
    }
    
    // Additional deductions for high utilities
    if (utilities > 250) {
      deductions += 15;
    } else if (utilities > 150) {
      deductions += 8;
    }
    
    // Pet fee considerations
    if (costs.petFee > 300) {
      deductions += 10;
    }
    
    const affordabilityScore = Math.max(0, baseScore - deductions);

    const recommendations = [];
    if (totalMonthly > 3500) {
      recommendations.push("This is above typical Ontario rental prices. Consider sharing costs or looking in less expensive areas.");
    } else if (totalMonthly > 2800) {
      recommendations.push("This is above average for Ontario. Consider if the location/amenities justify the premium.");
    } else if (totalMonthly > 2200) {
      recommendations.push("This is typical for Ontario rentals. Good balance of cost and location.");
    } else if (totalMonthly > 1800) {
      recommendations.push("This is below average for Ontario - good value for money!");
    } else {
      recommendations.push("Excellent price for Ontario! This is well below market average.");
    }
    
    if (utilities > 250) {
      recommendations.push("Utilities are high for Ontario. Look for energy-efficient properties or inclusive utilities.");
    }
    if (costs.petFee > 300) {
      recommendations.push("Pet fees are high for Ontario. Some landlords offer lower or no pet fees.");
    }

    setCalculationResult({
      monthlyRent,
      annualRent,
      utilities,
      insurance,
      totalMonthly,
      totalAnnual,
      affordabilityScore,
      recommendations
    });
  };

  const calculateAffordability = () => {
    const monthlyIncome = parseFloat(affordabilityInputs.monthlyIncome) || 0;
    const monthlyDebts = parseFloat(affordabilityInputs.monthlyDebts) || 0;
    const savings = parseFloat(affordabilityInputs.savings) || 0;
    const creditScore = parseFloat(affordabilityInputs.creditScore) || 0;

    // 30% rule for rent affordability
    const maxRent = monthlyIncome * 0.3;
    const recommendedRent = monthlyIncome * 0.25;
    const debtToIncomeRatio = monthlyDebts / monthlyIncome;

    const isAffordable = maxRent > 0 && debtToIncomeRatio < 0.43;

    const warnings = [];
    if (debtToIncomeRatio > 0.43) {
      warnings.push("Your debt-to-income ratio is high for Ontario standards. Consider paying down debt first.");
    }
    if (savings < monthlyIncome * 3) {
      warnings.push("Consider building emergency savings before renting in Ontario's competitive market.");
    }
    if (creditScore < 650) {
      warnings.push("Your credit score may affect rental applications in Ontario's competitive market.");
    }
    
    // Ontario-specific warnings
    if (monthlyIncome < 4000 && maxRent > 1200) {
      warnings.push("With your income, consider more affordable areas or roommates to stay within budget.");
    }
    if (monthlyIncome < 6000 && maxRent > 1800) {
      warnings.push("Consider if this rent leaves enough for other living expenses in Ontario.");
    }

    setAffordabilityResult({
      maxRent,
      recommendedRent,
      monthlyIncome,
      debtToIncomeRatio,
      isAffordable,
      warnings
    });
  };

  const calculateInvestment = () => {
    const propertyValue = parseFloat(investmentInputs.propertyValue) || 0;
    const monthlyRent = parseFloat(investmentInputs.monthlyRent) || 0;
    const propertyTax = parseFloat(investmentInputs.propertyTax) || 0;
    const insurance = parseFloat(investmentInputs.insurance) || 0;
    const maintenance = parseFloat(investmentInputs.maintenance) || 0;
    const propertyManagement = parseFloat(investmentInputs.propertyManagement) || 0;
    const vacancyRate = parseFloat(investmentInputs.vacancyRate) || 0;
    const mortgagePayment = parseFloat(investmentInputs.mortgagePayment) || 0;

    const annualRent = monthlyRent * 12;
    const annualExpenses = (propertyTax + insurance + maintenance + propertyManagement) * 12;
    const vacancyLoss = annualRent * (vacancyRate / 100);
    const annualMortgage = mortgagePayment * 12;
    
    const netOperatingIncome = annualRent - annualExpenses - vacancyLoss;
    const cashFlow = netOperatingIncome - annualMortgage;
    const capRate = (netOperatingIncome / propertyValue) * 100;
    const cashOnCashReturn = (cashFlow / (propertyValue * 0.2)) * 100; // Assuming 20% down

    return {
      annualRent,
      annualExpenses,
      vacancyLoss,
      netOperatingIncome,
      cashFlow,
      capRate,
      cashOnCashReturn
    };
  };

  const [investmentResult, setInvestmentResult] = useState<any>(null);

  const calculateInvestmentReturn = () => {
    const result = calculateInvestment();
    setInvestmentResult(result);
  };

  const tabs = [
    { id: 'rental-cost', label: 'Rental Cost Calculator', icon: Home },
    { id: 'affordability', label: 'Affordability Calculator', icon: TrendingUp },
    { id: 'investment', label: 'Investment Calculator', icon: DollarSign }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Rental Calculator
          </h1>
          <p className="text-xl text-gray-200 max-w-3xl mx-auto">
            Make informed decisions about your rental with our comprehensive calculators. 
            Whether you're a tenant or landlord, we've got you covered.
          </p>
        </motion.div>

        {/* Tab Navigation */}
                 <div className="flex flex-wrap justify-center gap-4 mb-8">
           {tabs.map((tab) => {
             const Icon = tab.icon;
             return (
               <Button
                 key={tab.id}
                 variant={activeTab === tab.id ? 'default' : 'outline'}
                 onClick={() => setActiveTab(tab.id as any)}
                 className={`flex items-center gap-2 px-6 py-3 transition-transform duration-200 hover:scale-105 ${
                   activeTab === tab.id 
                     ? 'bg-white text-gray-900 hover:bg-gray-100' 
                     : 'bg-transparent text-white border-white hover:bg-white hover:text-gray-900'
                 }`}
               >
                 <Icon className="w-5 h-5" />
                 {tab.label}
               </Button>
             );
           })}
         </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'rental-cost' && (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calculator className="w-6 h-6" />
                      Rental Cost Calculator
                    </CardTitle>
                    <CardDescription>
                      Calculate the total cost of renting a property including all fees and utilities.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Base Monthly Rent
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={rentalCosts.baseRent}
                          onChange={(e) => setRentalCosts(prev => ({ ...prev, baseRent: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Utilities (Monthly)
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={rentalCosts.utilities}
                          onChange={(e) => setRentalCosts(prev => ({ ...prev, utilities: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Internet
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={rentalCosts.internet}
                          onChange={(e) => setRentalCosts(prev => ({ ...prev, internet: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Parking
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={rentalCosts.parking}
                          onChange={(e) => setRentalCosts(prev => ({ ...prev, parking: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Pet Fee (One-time)
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={rentalCosts.petFee}
                          onChange={(e) => setRentalCosts(prev => ({ ...prev, petFee: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Security Deposit
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={rentalCosts.securityDeposit}
                          onChange={(e) => setRentalCosts(prev => ({ ...prev, securityDeposit: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Application Fee
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={rentalCosts.applicationFee}
                          onChange={(e) => setRentalCosts(prev => ({ ...prev, applicationFee: e.target.value }))}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Renter's Insurance
                        </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={rentalCosts.insurance}
                          onChange={(e) => setRentalCosts(prev => ({ ...prev, insurance: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button onClick={calculateRentalCost} className="w-full">
                      Calculate Total Cost
                    </Button>
                  </CardContent>
                </Card>

                {/* Results */}
                {calculationResult && (
                  <Card className="h-fit">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        Cost Breakdown
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            ${calculationResult.totalMonthly.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Monthly Total</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            ${calculationResult.totalAnnual.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Annual Total</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Base Rent:</span>
                          <span className="font-semibold">${calculationResult.monthlyRent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Utilities & Internet:</span>
                          <span className="font-semibold">${calculationResult.utilities.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Insurance:</span>
                          <span className="font-semibold">${calculationResult.insurance.toLocaleString()}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Total Monthly:</span>
                          <span>${calculationResult.totalMonthly.toLocaleString()}</span>
                        </div>
                      </div>

                      <div className="mt-6">
                        <div className="flex items-center gap-2 mb-3">
                          <Info className="w-5 h-5 text-blue-600" />
                          <span className="font-semibold">Affordability Score</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-3 rounded-full transition-all duration-300"
                            style={{ width: `${calculationResult.affordabilityScore}%` }}
                          ></div>
                        </div>
                                                 <div className="text-sm text-gray-200 mt-2">
                           {calculationResult.affordabilityScore >= 85 ? 'Excellent Value' : 
                            calculationResult.affordabilityScore >= 70 ? 'Good Value' : 
                            calculationResult.affordabilityScore >= 50 ? 'Fair Price' : 
                            calculationResult.affordabilityScore >= 30 ? 'Expensive' : 'Very Expensive'}
                         </div>
                      </div>

                      {calculationResult.recommendations.length > 0 && (
                        <div className="mt-6">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                            <span className="font-semibold">Recommendations</span>
                          </div>
                          <ul className="space-y-2">
                                                         {calculationResult.recommendations.map((rec, index) => (
                               <li key={index} className="text-sm text-gray-200 flex items-start gap-2">
                                 <span className="text-blue-400 mt-1">•</span>
                                 {rec}
                               </li>
                             ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'affordability' && (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-6 h-6" />
                      Affordability Calculator
                    </CardTitle>
                    <CardDescription>
                      Determine how much rent you can afford based on your income and financial situation.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-4">
                                             <div>
                         <label className="block text-sm font-medium text-gray-200 mb-2">
                           Monthly Income
                         </label>
                         <Input
                           type="number"
                           placeholder="0"
                           value={affordabilityInputs.monthlyIncome}
                           onChange={(e) => setAffordabilityInputs(prev => ({ ...prev, monthlyIncome: e.target.value }))}
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-200 mb-2">
                           Monthly Debt Payments
                         </label>
                         <Input
                           type="number"
                           placeholder="0"
                           value={affordabilityInputs.monthlyDebts}
                           onChange={(e) => setAffordabilityInputs(prev => ({ ...prev, monthlyDebts: e.target.value }))}
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-200 mb-2">
                           Savings
                         </label>
                         <Input
                           type="number"
                           placeholder="0"
                           value={affordabilityInputs.savings}
                           onChange={(e) => setAffordabilityInputs(prev => ({ ...prev, savings: e.target.value }))}
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-200 mb-2">
                           Credit Score
                         </label>
                         <Input
                           type="number"
                           placeholder="0"
                           value={affordabilityInputs.creditScore}
                           onChange={(e) => setAffordabilityInputs(prev => ({ ...prev, creditScore: e.target.value }))}
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-200 mb-2">
                           Employment Type
                         </label>
                        <select
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={affordabilityInputs.employmentType}
                          onChange={(e) => setAffordabilityInputs(prev => ({ ...prev, employmentType: e.target.value }))}
                        >
                          <option value="full-time">Full-time</option>
                          <option value="part-time">Part-time</option>
                          <option value="self-employed">Self-employed</option>
                          <option value="student">Student</option>
                        </select>
                      </div>
                    </div>
                    <Button onClick={calculateAffordability} className="w-full">
                      Calculate Affordability
                    </Button>
                  </CardContent>
                </Card>

                {/* Results */}
                {affordabilityResult && (
                  <Card className="h-fit">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        Affordability Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            ${affordabilityResult.maxRent.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Maximum Rent</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            ${affordabilityResult.recommendedRent.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Recommended Rent</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Monthly Income:</span>
                          <span className="font-semibold">${affordabilityResult.monthlyIncome.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Debt-to-Income Ratio:</span>
                          <span className="font-semibold">{(affordabilityResult.debtToIncomeRatio * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Affordability Status:</span>
                          <span className={`font-semibold ${affordabilityResult.isAffordable ? 'text-green-600' : 'text-red-600'}`}>
                            {affordabilityResult.isAffordable ? 'Affordable' : 'Not Affordable'}
                          </span>
                        </div>
                      </div>

                      {affordabilityResult.warnings.length > 0 && (
                        <div className="mt-6">
                          <div className="flex items-center gap-2 mb-3">
                            <AlertCircle className="w-5 h-5 text-orange-600" />
                            <span className="font-semibold">Important Notes</span>
                          </div>
                          <ul className="space-y-2">
                                                         {affordabilityResult.warnings.map((warning, index) => (
                               <li key={index} className="text-sm text-gray-200 flex items-start gap-2">
                                 <span className="text-orange-400 mt-1">•</span>
                                 {warning}
                               </li>
                             ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'investment' && (
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <Card className="h-fit">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <DollarSign className="w-6 h-6" />
                      Investment Calculator
                    </CardTitle>
                    <CardDescription>
                      Calculate potential returns on rental property investments.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                             <div>
                         <label className="block text-sm font-medium text-gray-200 mb-2">
                           Property Value
                         </label>
                         <Input
                           type="number"
                           placeholder="0"
                           value={investmentInputs.propertyValue}
                           onChange={(e) => setInvestmentInputs(prev => ({ ...prev, propertyValue: e.target.value }))}
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-200 mb-2">
                           Monthly Rent
                         </label>
                         <Input
                           type="number"
                           placeholder="0"
                           value={investmentInputs.monthlyRent}
                           onChange={(e) => setInvestmentInputs(prev => ({ ...prev, monthlyRent: e.target.value }))}
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-200 mb-2">
                           Property Tax (Monthly)
                         </label>
                         <Input
                           type="number"
                           placeholder="0"
                           value={investmentInputs.propertyTax}
                           onChange={(e) => setInvestmentInputs(prev => ({ ...prev, propertyTax: e.target.value }))}
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-200 mb-2">
                           Insurance (Monthly)
                         </label>
                         <Input
                           type="number"
                           placeholder="0"
                           value={investmentInputs.insurance}
                           onChange={(e) => setInvestmentInputs(prev => ({ ...prev, insurance: e.target.value }))}
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-200 mb-2">
                           Maintenance (Monthly)
                         </label>
                         <Input
                           type="number"
                           placeholder="0"
                           value={investmentInputs.maintenance}
                           onChange={(e) => setInvestmentInputs(prev => ({ ...prev, maintenance: e.target.value }))}
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-200 mb-2">
                           Property Management (%)
                         </label>
                         <Input
                           type="number"
                           placeholder="0"
                           value={investmentInputs.propertyManagement}
                           onChange={(e) => setInvestmentInputs(prev => ({ ...prev, propertyManagement: e.target.value }))}
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-200 mb-2">
                           Vacancy Rate (%)
                         </label>
                         <Input
                           type="number"
                           placeholder="0"
                           value={investmentInputs.vacancyRate}
                           onChange={(e) => setInvestmentInputs(prev => ({ ...prev, vacancyRate: e.target.value }))}
                         />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-gray-200 mb-2">
                           Mortgage Payment
                         </label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={investmentInputs.mortgagePayment}
                          onChange={(e) => setInvestmentInputs(prev => ({ ...prev, mortgagePayment: e.target.value }))}
                        />
                      </div>
                    </div>
                    <Button onClick={calculateInvestmentReturn} className="w-full">
                      Calculate Returns
                    </Button>
                  </CardContent>
                </Card>

                {/* Results */}
                {investmentResult && (
                  <Card className="h-fit">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-6 h-6 text-green-600" />
                        Investment Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">
                            {investmentResult.capRate.toFixed(2)}%
                          </div>
                          <div className="text-sm text-gray-600">Cap Rate</div>
                        </div>
                        <div className="text-center p-4 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">
                            {investmentResult.cashOnCashReturn.toFixed(2)}%
                          </div>
                          <div className="text-sm text-gray-600">Cash-on-Cash Return</div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span>Annual Rent:</span>
                          <span className="font-semibold">${investmentResult.annualRent.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Annual Expenses:</span>
                          <span className="font-semibold">${investmentResult.annualExpenses.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vacancy Loss:</span>
                          <span className="font-semibold">${investmentResult.vacancyLoss.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Net Operating Income:</span>
                          <span className="font-semibold">${investmentResult.netOperatingIncome.toLocaleString()}</span>
                        </div>
                        <hr />
                        <div className="flex justify-between text-lg font-bold">
                          <span>Annual Cash Flow:</span>
                          <span className={investmentResult.cashFlow >= 0 ? 'text-green-600' : 'text-red-600'}>
                            ${investmentResult.cashFlow.toLocaleString()}
                          </span>
                        </div>
                      </div>

                                             <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                         <div className="flex items-center gap-2 mb-3">
                           <Info className="w-5 h-5 text-blue-400" />
                           <span className="font-semibold text-white">Investment Assessment</span>
                         </div>
                         <div className="text-sm text-gray-200 space-y-2">
                          {investmentResult.capRate > 6 ? (
                            <p>✅ Good cap rate for rental properties</p>
                          ) : (
                            <p>⚠️ Consider negotiating a better purchase price</p>
                          )}
                          {investmentResult.cashOnCashReturn > 8 ? (
                            <p>✅ Strong cash-on-cash return</p>
                          ) : (
                            <p>⚠️ May need to improve rental income or reduce costs</p>
                          )}
                          {investmentResult.cashFlow >= 0 ? (
                            <p>✅ Positive cash flow - good investment</p>
                          ) : (
                            <p>❌ Negative cash flow - reconsider investment</p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Additional Information */}
        <motion.div 
          className="mt-16 grid md:grid-cols-3 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-600" />
                Rental Cost Tips
              </CardTitle>
            </CardHeader>
                         <CardContent>
               <ul className="space-y-2 text-sm text-gray-200">
                 <li>• Ontario average rent is $2,200-2,800 for 1-2 bedrooms</li>
                 <li>• Utilities typically $150-250/month in Ontario</li>
                 <li>• Security deposits are limited to 1 month's rent</li>
                 <li>• Pet fees vary widely - some landlords don't charge</li>
                 <li>• Rent control applies to buildings occupied before 2018</li>
               </ul>
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <TrendingUp className="w-5 h-5 text-green-400" />
                 Affordability Guidelines
               </CardTitle>
             </CardHeader>
             <CardContent>
               <ul className="space-y-2 text-sm text-gray-200">
                 <li>• Ontario rent should not exceed 30% of income</li>
                 <li>• Aim for 25% for better financial flexibility</li>
                 <li>• Consider debt-to-income ratio below 43%</li>
                 <li>• Maintain 3-6 months emergency savings</li>
                 <li>• Factor in Ontario's high cost of living</li>
               </ul>
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <DollarSign className="w-5 h-5 text-purple-400" />
                 Investment Metrics
               </CardTitle>
             </CardHeader>
             <CardContent>
               <ul className="space-y-2 text-sm text-gray-200">
                 <li>• Cap Rate: 6-8% is generally good</li>
                 <li>• Cash-on-Cash: 8-12% is ideal</li>
                 <li>• Positive cash flow is essential</li>
                 <li>• Consider property appreciation</li>
                 <li>• Factor in maintenance costs</li>
               </ul>
             </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
} 