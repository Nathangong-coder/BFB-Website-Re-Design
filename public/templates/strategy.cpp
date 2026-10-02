/**
 * ==============================================================================
 * BFB at UCLA - Alpha Research Competition
 * C++ Strategy Implementation (strategy.cpp)
 * ==============================================================================
 * 
 * Compilation Instructions:
 *   g++ -O3 -std=c++20 strategy.cpp -o strategy_runner
 * 
 * Execution Contract:
 *   ./strategy_runner market_data.json signals.json
 * 
 * Input Schema (market_data.json):
 *   {"timestamp": "...", "prices": {"AAPL": 180.50, ...}, "ohlcv": {...}}
 * 
 * Output Schema (signals.json):
 *   {"AAPL": 0.10, "MSFT": -0.05, "BTCUSDT": 0.05}
 */

#include <iostream>
#include <fstream>
#include <string>
#include <unordered_map>
#include <sstream>

// Core Quantitative Signal Generator
std::unordered_map<std::string, double> generate_signals(const std::string& market_data_json) {
    std::unordered_map<std::string, double> target_weights;

    // --------------------------------------------------------------------------
    // YOUR STRATEGY LOGIC HERE
    // --------------------------------------------------------------------------
    target_weights["AAPL"] = 0.05;
    target_weights["MSFT"] = -0.03;
    target_weights["BTCUSDT"] = 0.02;

    return target_weights;
}

int main(int argc, char* argv[]) {
    std::cout << "BFB at UCLA Alpha Research Competition C++ Runner\n";

    if (argc >= 3) {
        std::string input_path = argv[1];
        std::string output_path = argv[2];

        std::ifstream input_file(input_path);
        if (!input_file.is_open()) {
            std::cerr << "Error opening input file: " << input_path << "\n";
            return 1;
        }

        std::stringstream buffer;
        buffer << input_file.rdbuf();
        std::string json_data = buffer.str();
        input_file.close();

        auto weights = generate_signals(json_data);

        std::ofstream output_file(output_path);
        if (!output_file.is_open()) {
            std::cerr << "Error writing output file: " << output_path << "\n";
            return 1;
        }

        output_file << "{\n";
        size_t count = 0;
        for (const auto& [symbol, weight] : weights) {
            output_file << "  \"" << symbol << "\": " << weight;
            if (++count < weights.size()) output_file << ",";
            output_file << "\n";
        }
        output_file << "}\n";
        output_file.close();

        std::cout << "Successfully generated C++ signals for " << weights.size() << " assets -> " << output_path << "\n";
    } else {
        std::cout << "Usage: ./strategy_runner <input_market_data.json> <output_signals.json>\n";
    }

    return 0;
}
