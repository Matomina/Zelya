import { AlertTriangle } from 'lucide-react'

interface LegalSection { title: string; content: string }

function LegalPageTemplate({ title, sections, todoNote }: { title: string; sections: LegalSection[]; todoNote?: string }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="heading-lg text-z-text mb-8">{title}</h1>

      {todoNote && (
        <div
          className="flex items-start gap-3 rounded-2xl p-5 mb-8"
          style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.25)' }}
        >
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 font-semibold text-sm mb-1">TODO — Document de maquette</p>
            <p className="text-amber-200/80 text-sm leading-relaxed">{todoNote}</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {sections.map((section, i) => (
          <section
            key={i}
            className="rounded-2xl p-6"
            style={{ background: 'rgba(13,12,30,0.7)', border: '1px solid rgba(30,27,58,0.8)' }}
          >
            <h2 className="font-semibold text-z-text text-base mb-4">{section.title}</h2>
            <p className="text-z-muted text-sm leading-relaxed whitespace-pre-line">{section.content}</p>
          </section>
        ))}
      </div>

      <p className="text-xs text-z-faint mt-8 text-center">
        Dernière mise à jour : [Date — à compléter]
      </p>
    </div>
  )
}

export function MentionsLegalesPage() {
  return (
    <LegalPageTemplate
      title="Mentions légales"
      todoNote="Ce document est un placeholder de maquette. Il doit être rédigé par un avocat spécialisé et complété avec les informations réelles de la société avant toute mise en production."
      sections={[
        {
          title: 'Éditeur du site',
          content: `Raison sociale : [À compléter]\nForme juridique : [À compléter — SAS, SARL, etc.]\nCapital social : [À compléter]\nSiège social : [Adresse à compléter]\nSIRET : [À compléter]\nRCS : [À compléter]\nDirecteur de publication : [À compléter]\n\nContact : contact@zelya.fr (placeholder)`,
        },
        {
          title: 'Hébergeur',
          content: `Nom de l'hébergeur : [À compléter]\nAdresse : [À compléter]\nTéléphone : [À compléter]`,
        },
        {
          title: 'Propriété intellectuelle',
          content: `L'ensemble des éléments constituant le site Zelya (textes, graphismes, logiciels, photographies, sons, noms, logos, marques) sont la propriété exclusive de la société [Raison sociale].\n\nToute reproduction ou représentation non autorisée est interdite.`,
        },
        {
          title: 'Droit applicable et juridiction',
          content: `Le présent site est soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents.`,
        },
      ]}
    />
  )
}

export function ConfidentialitePage() {
  return (
    <LegalPageTemplate
      title="Politique de confidentialité"
      todoNote="Ce document est un placeholder de maquette. Il doit être rédigé par un DPO certifié conformément au RGPD et validé par la CNIL avant toute mise en production."
      sections={[
        {
          title: 'Responsable du traitement',
          content: `[Raison sociale — À compléter]\n[Adresse — À compléter]\nDPO : dpo@zelya.fr (placeholder)`,
        },
        {
          title: 'Données collectées',
          content: `— Email (obligatoire)\n— Pseudo (obligatoire)\n— Date de naissance (vérification d'âge)\n— Adresse IP (sécurité, logs)\n— Données de navigation (cookies essentiels uniquement)`,
        },
        {
          title: 'Finalités et base légale',
          content: `— Exécution du contrat (compte utilisateur)\n— Obligation légale (vérification d'âge)\n— Intérêt légitime (sécurité)\n— Consentement (communications marketing)`,
        },
        {
          title: 'Durée de conservation',
          content: `— Données de compte : durée de l'abonnement + 3 ans\n— Logs de connexion : 12 mois (obligation légale)\n— Données de facturation : 10 ans (obligation fiscale)`,
        },
        {
          title: 'Vos droits',
          content: `Conformément au RGPD :\n— Droit d'accès\n— Droit de rectification\n— Droit à l'effacement\n— Droit à la limitation\n— Droit à la portabilité\n— Droit d'opposition\n\nContact : dpo@zelya.fr\nRéclamation : www.cnil.fr`,
        },
        {
          title: 'Cookies',
          content: `Nous utilisons uniquement des cookies strictement nécessaires au fonctionnement du site.\n\nAucun cookie publicitaire sans consentement explicite.\n\n[TODO : Paramétrer un outil de gestion du consentement conforme CNIL]`,
        },
      ]}
    />
  )
}

export function CguPage() {
  return (
    <LegalPageTemplate
      title="Conditions Générales d'Utilisation"
      todoNote="Ce document est un placeholder de maquette. Il doit être rédigé par un avocat spécialisé dans le droit du numérique avant toute mise en production."
      sections={[
        {
          title: 'Objet',
          content: `Les présentes CGU définissent les conditions dans lesquelles les utilisateurs peuvent accéder au service Zelya.`,
        },
        {
          title: 'Accès au service',
          content: `Le service est réservé exclusivement aux personnes majeures (18 ans et plus). L'accès est interdit aux mineurs.\n\nEn utilisant le service, vous certifiez avoir 18 ans ou plus.`,
        },
        {
          title: 'Comportements interdits',
          content: `Il est formellement interdit de :\n— Publier du contenu impliquant des mineurs\n— Usurper l'identité d'une autre personne\n— Publier du contenu sans consentement\n— Harceler ou menacer d'autres utilisateurs\n— Contourner les systèmes de vérification d'âge\n— Publier du contenu illégal`,
        },
        {
          title: 'Modération',
          content: `[Politique de modération à définir]\n\nZelya se réserve le droit de supprimer tout contenu et de suspendre tout compte contrevenant.`,
        },
        {
          title: 'Signalement',
          content: `Tout contenu problématique peut être signalé via le formulaire disponible sur chaque profil.\n\nDélai de traitement : 24h ouvrées.`,
        },
        {
          title: 'Droit applicable',
          content: `Les présentes CGU sont soumises au droit français.`,
        },
      ]}
    />
  )
}
