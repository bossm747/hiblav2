#!/bin/bash

echo "Starting bulk AI image generation for all products..."

# Get all products and generate images
curl -s http://localhost:5000/api/products | jq -r '.[] | @json' | while IFS= read -r product; do
    # Parse product data
    id=$(echo "$product" | jq -r '.id')
    name=$(echo "$product" | jq -r '.name')
    hairType=$(echo "$product" | jq -r '.hairType // "human"')
    texture=$(echo "$product" | jq -r '.texture // "straight"')
    length=$(echo "$product" | jq -r '.length // 20')
    color=$(echo "$product" | jq -r '.color // "Natural Black"')
    description=$(echo "$product" | jq -r '.description // ""')
    
    echo "Generating image for: $name"
    
    # Generate image
    response=$(curl -s -X POST http://localhost:5000/api/ai/generate-product-image \
        -H "Content-Type: application/json" \
        -d "{
            \"productId\": \"$id\",
            \"productName\": \"$name\",
            \"hairType\": \"$hairType\",
            \"texture\": \"$texture\",
            \"length\": $length,
            \"color\": \"$color\",
            \"description\": \"$description\"
        }")
    
    success=$(echo "$response" | jq -r '.success // false')
    
    if [ "$success" = "true" ]; then
        imagePath=$(echo "$response" | jq -r '.imagePath')
        echo "✓ Success: $name -> $imagePath"
    else
        error=$(echo "$response" | jq -r '.error // "Unknown error"')
        echo "✗ Failed: $name -> $error"
    fi
    
    # Wait 3 seconds between requests to avoid rate limiting
    sleep 3
done

echo "Bulk image generation completed!"