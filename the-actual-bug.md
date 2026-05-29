# DO NOT MODIFY THIS FILE

The actual bug, as I understand it:

- an entire network response is written into the store for query Q1, which contains a $shouldDefer: Boolean! variable
- in the query, there is an @defer(if: $shouldDefer)
- environment.check with shouldDefer: true -> missing
- environment.check with false -> not missing

NOTHING ELSE ABOUT THE QUERY, ETC IS DETERMINED. USE ANY OTHER FEATURES, FOR EXAMPLE CONNECTIONS, @INCLUDE (w/other variables), CLIENT SCHEMA EXTENSIONS, etc

Play around with various permutations until you can repro this **exactly as described above**.

---------

in ~/code/pinboard/webapp, look at the closeuprelatedmodulesquery. That is the one for which this behavior is exhibited.

In particular, useAuthRelatedPinsQueryPreload.ts calls preloadQuery, which eventually calls createQueryPreloader.ts, and the call to

    const queryRef = loadQuery<T, EnvironmentProviderOptions>(
      relayEnvironment,
      getRequest(descriptor.query),
      (descriptor.variables ?? {}) as Record<string, unknown>,
    );

goes to network if shouldDefer is true, but not otherwise.