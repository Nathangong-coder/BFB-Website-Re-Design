/**
 * ==============================================================================
 * BFB at UCLA - Sample C++ Strategy Implementation (strategy.cpp)
 * ==============================================================================
 * Strategy: Statistical Arbitrage & Volatility Scaling
 */

#include <iostream>
#include <fstream>
#include <string>
#include <unordered_map>
#include <sstream>

std::unordered_map<std::string, double> generate_signals(const std::string& market_data_json) {
    std::unordered_map<std::string, double> target_weights;

    // YOUR STRATEGY LOGIC HERE
    // Example: Balanced Long/Short Allocation respecting 20% single position limit
    target_weights["AAPL"] = 0.12;
    target_weights["MSFT"] = -0.08;
    target_weights["NVDA"] = 0.10;
    target_weights["BTCUSDT"] = 0.05;
    target_weights["ETHUSDT"] = -0.03;

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

        std::cout << "C++ Strategy: Generated signals for " << weights.size() << " assets -> " << output_path << "\n";
    } else {
        std::cout << "Usage: ./strategy_runner <input_market_data.json> <output_signals.json>\n";
    }

    return 0;
}
