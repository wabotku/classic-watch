async function merchant(db, filters) {
  try {
    const whereClause = {};

    // Build the where clause based on the filters
    // if (filters.name) {
    //   whereClause.name = { [Op.like]: `%${filters.name}%` };
    // }

    // if (filters.minPrice) {
    //   whereClause.price = { [Op.gte]: filters.minPrice };
    // }

    // if (filters.maxPrice) {
    //   whereClause.price = {
    //     ...whereClause.price,
    //     [Op.lte]: filters.maxPrice,
    //   };
    // }

    // if (filters.category) {
    //   whereClause.category = filters.category;
    // }

    // Fetch the products using the where clause
    const result = await db.findAll({ where: whereClause });

    return result;
  } catch (error) {
    console.error("Error filtering products:", error);
  }
}

module.exports = { merchant };
