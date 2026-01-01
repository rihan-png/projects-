// Student Management System (C++)
// Compile: g++ main.cpp -o main
// Run: ./main

#include <iostream>
#include <vector>
#include <string>

using namespace std;

class Student {
    string name;
    int rollNo;
public:
    Student(string n, int r) : name(n), rollNo(r) {}
    void display() {
        cout << "Name: " << name << " | Roll: " << rollNo << endl;
    }
};

int main() {
    vector<Student> db;
    db.push_back(Student("Alex", 101));
    db.push_back(Student("Sam", 102));
    
    cout << "--- Student Database ---" << endl;
    for(auto &s : db) s.display();
    return 0;
}

