# BFB at UCLA - Alpha Research Competition C++ Makefile
CXX = g++
CXXFLAGS = -O3 -std=c++20 -Wall -Wextra
TARGET = strategy_runner
SRC = bfb_alpha_template.cpp

all: $(TARGET)

$(TARGET): $(SRC)
	$(CXX) $(CXXFLAGS) $(SRC) -o $(TARGET)

clean:
	rm -f $(TARGET)
