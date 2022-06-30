#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Tue Mar  8 14:14:59 2022

@author: korlan
"""

import sys
import pandas as pd
import numpy as np

# Transforming csv file into distance matrix
def get_distance_neighbor(embeddings):
    distance_matrix =np.zeros(((embeddings.values).shape[0],(embeddings.values).shape[0]))
    emb = (embeddings.values)
    for i in range(embeddings.shape[0]):
        for j in range(embeddings.shape[0]):      
            emb_i = emb[i]
            emb_j = emb[j]
            d = np.linalg.norm(emb_j - emb_i)
            distance_matrix[i,j] = d
    neighbors = distance_matrix.argsort()
    
    return distance_matrix, neighbors


# File opening
df = pd.read_csv (sys.argv[1], index_col="id")
name = sys.argv[1].split("_")[2]
distance, neighbor = get_distance_neighbor(df)

# Mappings indexes from original file to generated files
distance = pd.DataFrame(distance)
neighbor = pd.DataFrame(neighbor)
distance.index = df.index
distance.columns = df.index
neighbor.index = df.index

# Generation new files
distance.to_csv(f"../../public/data/distance_{name}")
neighbor.to_csv(f"../../public/data/neighbor_{name}")

# For test purposes
#distance.to_csv(f"distance_test_{name}")
#neighbor.to_csv(f"neighbor_test_{name}")
