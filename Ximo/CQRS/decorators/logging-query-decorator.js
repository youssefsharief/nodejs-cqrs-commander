function queryLogger(fn, queryName, query) {
    
        console.log(`Start reading ${queryName}`)
        console.time('start query')
    
        try {
            return fn(query)
        } catch (e) {
            console.error(`Exception throw while reading query ${queryName}  ${e.message}   ${e.type} - Time taken: ${console.timeEnd('start query')} `)
        } finally {
            console.timeEnd('start query')
        }
    
    }
    
    module.exports = {queryLogger}




using System;
using System.Diagnostics;
using Microsoft.Extensions.Logging;

namespace Ximo.Cqrs.Decorators
{
    /// <summary>
    ///     Provides a decorator for query handlers that logs entry, exit and errors resulting from processing a query as
    ///     well as provides execution elapsed time. This class cannot be inherited.
    /// </summary>
    /// <typeparam name="TQuery">The type of the query.</typeparam>
    /// <typeparam name="TResult">The type of the result.</typeparam>
    /// <seealso cref="Ximo.Cqrs.Decorators.IQueryDecorator{TQuery, TResult}" />
    public sealed class LoggingQueryDecorator<TQuery, TResult> : IQueryDecorator<TQuery, TResult>
        where TQuery : class
    {
        private readonly IQueryHandler<TQuery, TResult> _decorated;
        private readonly ILogger<LoggingQueryDecorator<TQuery, TResult>> _logger;

        /// <summary>
        ///     Initializes a new instance of the <see cref="LoggingQueryDecorator{TQuery,TResult}" /> class.
        /// </summary>
        /// <param name="decorated">The decorated query handler.</param>
        /// <param name="logger">The configured logger.</param>
        public LoggingQueryDecorator(IQueryHandler<TQuery, TResult> decorated,
            ILogger<LoggingQueryDecorator<TQuery, TResult>> logger)
        {
            _decorated = decorated;
            _logger = logger;
        }

        /// <summary>
        ///     Reads the specified query while applying decorator logic.
        /// </summary>
        /// <param name="query">The query.</param>
        /// <returns>TResult.</returns>
        public TResult Read(TQuery query)
        {
            TResult result;
            var queryName = query.GetType().Name;

            _logger.LogInformation($"Start reading query '{queryName}'" + Environment.NewLine);

            var stopwatch = new Stopwatch();
            stopwatch.Start();

            try
            {
                result = _decorated.Read(query);
            }
            catch (Exception e)
            {
                _logger.LogError($"Exception throw while reading query '{queryName}'" +
                                 Environment.NewLine + e.Message + Environment.NewLine);
                throw;
            }
            finally
            {
                stopwatch.Stop();
            }

            _logger.LogInformation($"Executed query '{queryName}' in {stopwatch.Elapsed}." +
                                   Environment.NewLine);

            return result;
        }
    }
}
