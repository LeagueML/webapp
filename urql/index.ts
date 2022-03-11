import { Client, createClient, dedupExchange, Exchange, fetchExchange } from 'urql';
import { offlineExchange } from '@urql/exchange-graphcache';
import { makeDefaultStorage } from '@urql/exchange-graphcache/default-storage';
import { retryExchange } from '@urql/exchange-retry';

class Urql {
    static Cache = class {
        static getStorage() : any {
            return makeDefaultStorage({
                idbName: 'graphcache-league.ml-v3', // The name of the IndexedDB database
                maxAge: 30, // The maximum age of the persisted data in days
            });
        }

        static getSchema() : any {
            return {

            }
        }

        static getMutationUpdates() : any
        {
            return {

            }
        }

        static getSubscriptionUpdates() : any {
            return {

            }
        }

        // see https://formidable.com/open-source/urql/docs/graphcache/cache-updates/#optimistic-updates
        static getOptimisticUpdates() : any {
            return {

            }
        }

        static getExchange() : Exchange {
            return offlineExchange({
                storage: this.getStorage(),
                schema: this.getSchema(),
                optimistic: this.getOptimisticUpdates(),
                updates: {
                    Mutation: this.getMutationUpdates(),
                    Subscription: this.getSubscriptionUpdates()
                }
            });
        }
    }

    static getExchanges() : Exchange[] {
        return [
            dedupExchange,
            this.Cache.getExchange(),
            fetchExchange
        ];
    }

    static createClient() : Client {
        return createClient({
            url: "https://api.league.ml/graphql",
            exchanges: this.getExchanges(),
        });
    }
}

export default Urql;