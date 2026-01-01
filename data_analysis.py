# Data Analysis Tool (Python)
# Prerequisite: pip install pandas matplotlib

import pandas as pd
import matplotlib.pyplot as plt

# Demo Data (No Excel file needed for this test)
data = {
    'Student': ['Alice', 'Bob', 'Charlie', 'David'],
    'Score': [85, 92, 78, 90]
}

def analyze_scores():
    # Create DataFrame from mock data
    df = pd.DataFrame(data)
    
    # Calculate basic stats
    avg_score = df['Score'].mean()
    print(f"Average Class Score: {avg_score:.2f}")
    
    # Generate visualization
    print("Generating histogram...")
    # Note: plt.show() opens a window
    df['Score'].hist(bins=5)
    plt.title('Score Distribution')
    plt.show() 

if __name__ == "__main__":
    analyze_scores()
