// Bulk AI Image Generation for all products
const generateBulkProductImages = async () => {
  try {
    // Get all products
    const productsResponse = await fetch('http://localhost:5000/api/products');
    const products = await productsResponse.json();
    
    console.log(`Found ${products.length} products to generate images for`);
    
    // Generate images for all products in parallel with rate limiting
    const batchSize = 3; // Process 3 images at a time to avoid rate limits
    const results = [];
    
    for (let i = 0; i < products.length; i += batchSize) {
      const batch = products.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(products.length/batchSize)}`);
      
      const batchPromises = batch.map(async (product) => {
        try {
          console.log(`Generating image for: ${product.name}`);
          
          const imageResponse = await fetch('http://localhost:5000/api/ai/generate-product-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: product.id,
              productName: product.name,
              hairType: product.hairType,
              texture: product.texture,
              length: product.length,
              color: product.color,
              description: product.description
            })
          });
          
          const result = await imageResponse.json();
          
          if (result.success) {
            console.log(`✓ Generated image for ${product.name}: ${result.imagePath}`);
            return { 
              productId: product.id, 
              productName: product.name,
              success: true, 
              imagePath: result.imagePath 
            };
          } else {
            console.error(`✗ Failed to generate image for ${product.name}:`, result.error);
            return { 
              productId: product.id, 
              productName: product.name,
              success: false, 
              error: result.error 
            };
          }
        } catch (error) {
          console.error(`✗ Error generating image for ${product.name}:`, error.message);
          return { 
            productId: product.id, 
            productName: product.name,
            success: false, 
            error: error.message 
          };
        }
      });
      
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Wait between batches to avoid rate limiting
      if (i + batchSize < products.length) {
        console.log('Waiting 2 seconds before next batch...');
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
    
    // Summary
    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;
    
    console.log('\n=== BULK IMAGE GENERATION COMPLETE ===');
    console.log(`Total products: ${products.length}`);
    console.log(`Successfully generated: ${successful}`);
    console.log(`Failed: ${failed}`);
    
    if (failed > 0) {
      console.log('\nFailed products:');
      results.filter(r => !r.success).forEach(r => {
        console.log(`- ${r.productName}: ${r.error}`);
      });
    }
    
    console.log('\nSuccessful products:');
    results.filter(r => r.success).forEach(r => {
      console.log(`- ${r.productName}: ${r.imagePath}`);
    });
    
    return results;
    
  } catch (error) {
    console.error('Error in bulk image generation:', error);
    return [];
  }
};

// Run the bulk generation
generateBulkProductImages();