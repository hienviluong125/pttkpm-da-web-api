module.exports = async function ({
  model,
  queryOption,
  pageParams,
  limit,
  page,
  include = [],
  attributes = {},
  order = [['id', 'DESC']]
}) {
  const offset = limit * (page - 1);
  const queryRs = await model.findAndCountAll({
    where: queryOption,
    limit: limit,
    offset: offset,
    include: include,
    order: order,
    attributes: attributes,
    distinct: true
  });

  const count = queryRs.count;
  const firstPage = page === 1;
  const lastPage = offset + limit >= count;

  return {
    data: queryRs.rows,
    firstPage: firstPage,
    count: count,
    currentPage: page,
    lastPage: lastPage,
    prevPage: firstPage ? -1 : page - 1,
    nextPage: lastPage ? -1 : page + 1,
    totalPage: Math.ceil(count / limit)
  }
}