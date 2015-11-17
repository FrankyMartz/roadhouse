"use strict";

module.exports = [ "$compile", function ( $compile )
{
    return {
        scope: {
            definition: "=rhDefinition",
            save: "=rhOnSave",
            delete: "=rhOnDelete",
            cancel: "=rhOnCancel",
            model: "=rhModel",
            titleVisible: "=rhTitleVisible"
        },
        link: function ( scope, element )
        {
            if( typeof( scope.definition ) !== "object" )
            {
                element.html( "" );
                $compile( element.contents() )( scope );
                return;
            }

            var keys = Object.keys( scope.definition );
            var inputs = [];
            scope.model = scope.model || {};
            scope.toggleDeletePending = function ()
            {
                scope.deletePending = !scope.deletePending;
            };
            scope.deleteClick = function ()
            {
                scope.delete( scope.model );
            };
            scope.saveClick = function ( form )
            {
                if( form.$valid )
                {
                    scope.save( scope.model );
                }
            };

            scope.formFields = keys.filter( function ( key )
            {
                var def = scope.definition[ key ];
                return key !== "meta" && def.canView !== false && def.type !== "link";
            } )
            .map( function ( key )
            {
                var def = scope.definition[ key ];
                def.key = key;
                return def;
            } );

            var formName = "rh" + ( scope.definition.meta.title || "" ).replace( /[^\w\d]*/g, "" ) + "Form";
            scope.canDelete = scope.model.id && scope.definition.meta.canDelete !== false;

            var form = '<form name="' + formName + '" class="rh-form" data-ng-submit="saveClick( ' + formName + ' )">'
            + "  <h3 data-ng-if='titleVisible !== false'>"
            +   ( !scope.definition.id || scope.model.id ? "Edit " : "Add " )
            +   ( scope.definition.meta.title || "" )
            + "  </h3>"
            + '  <div ng-repeat="field in formFields" '
            + '    rh-field rh-model="model"'
            + '    rh-definition="field" rh-initial="!!model.id" ></div>'
            + '  <div class="form-controls clearfix initial" data-ng-hide="deletePending">'
            + '    <button type="button" class="btn btn-default" data-ng-click="cancel()">Cancel</button>'
            + '    <button type="button" class="btn btn-danger" data-ng-if="canDelete"'
            + '      data-ng-click="toggleDeletePending()">Delete</button>'
            + '    <button id="add-item-submit" type="submit" class="btn btn-primary">Save</button>'
            + "  </div>"
            + '  <div class="form-controls clearfix delete-confirm" '
            + '    data-ng-if="canDelete" data-ng-show="deletePending">'
            + "    <strong>Do you really want to delete this?</strong>"
            + '    <button type="button" class="btn btn-danger" data-ng-click="deleteClick()">Yes, Delete</button>'
            + '    <button type="button" class="btn btn-default" data-ng-click="toggleDeletePending()">Cancel</button>'
            + "  </div>"
            + "</form>";

            element.html( form );
            $compile( element.contents() )( scope );
        }
    };
} ];